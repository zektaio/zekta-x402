import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

const router = Router();

function getProgramIdFromAnchorToml(): string {
  try {
    const anchorTomlPath = join(process.cwd(), 'Anchor.toml');
    const tomlContent = readFileSync(anchorTomlPath, 'utf-8');
    const match = tomlContent.match(/zekta_vault\s*=\s*"([^"]+)"/);
    return match ? match[1] : 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS';
  } catch (error) {
    console.error('Failed to read Program ID from Anchor.toml:', error);
    return 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS';
  }
}

const GH_TOKEN = process.env.GH_PAT;
const GH_REPO = process.env.GH_REPO;

interface DeployRequest {
  network?: 'devnet' | 'mainnet-beta';
  program?: string;
}

interface GitHubWorkflowDispatch {
  ref: string;
  inputs: {
    network: string;
    program: string;
  };
}

router.post('/api/deploy', async (req: Request, res: Response) => {
  try {
    if (!GH_TOKEN || !GH_REPO) {
      return res.status(500).json({
        ok: false,
        error: 'GitHub configuration missing. Set GH_PAT and GH_REPO environment variables.'
      });
    }

    const { network = 'devnet', program = 'zekta_vault' }: DeployRequest = req.body || {};

    const workflowUrl = `https://api.github.com/repos/${GH_REPO}/actions/workflows/deploy.yml/dispatches`;
    
    const payload: GitHubWorkflowDispatch = {
      ref: 'main',
      inputs: {
        network,
        program
      }
    };

    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GH_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error:', errorText);
      return res.status(500).json({
        ok: false,
        error: `GitHub API error: ${response.statusText}`,
        details: errorText
      });
    }

    const programId = getProgramIdFromAnchorToml();
    
    return res.json({
      ok: true,
      message: `Deploy triggered successfully to ${network}`,
      details: 'Check GitHub Actions tab for build progress',
      actionsUrl: `https://github.com/${GH_REPO}/actions`,
      programId,
      network
    });

  } catch (error: any) {
    console.error('Deploy endpoint error:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Failed to trigger deployment'
    });
  }
});

router.get('/api/deploy/status', async (req: Request, res: Response) => {
  try {
    if (!GH_TOKEN || !GH_REPO) {
      return res.status(500).json({
        ok: false,
        error: 'GitHub configuration missing'
      });
    }

    const runsUrl = `https://api.github.com/repos/${GH_REPO}/actions/workflows/deploy.yml/runs?per_page=5`;
    
    const response = await fetch(runsUrl, {
      headers: {
        'Authorization': `Bearer ${GH_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: 'Failed to fetch deployment status'
      });
    }

    const data = await response.json();
    
    return res.json({
      ok: true,
      runs: data.workflow_runs.map((run: any) => ({
        id: run.id,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at,
        updated_at: run.updated_at,
        html_url: run.html_url
      }))
    });

  } catch (error: any) {
    console.error('Deploy status error:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Failed to get deployment status'
    });
  }
});

export default router;
