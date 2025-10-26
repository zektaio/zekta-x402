import { 
  PublicKey, 
  SystemProgram, 
  Connection,
  Keypair,
  TransactionInstruction
} from '@solana/web3.js';
import bs58 from 'bs58';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface VaultClient {
  connection: Connection;
  authorityKeypair: Keypair;
  programId: PublicKey;
  vaultPda: PublicKey;
  vaultBump: number;
}

function getProgramIdFromAnchorToml(): PublicKey {
  try {
    const anchorTomlPath = join(process.cwd(), 'Anchor.toml');
    const tomlContent = readFileSync(anchorTomlPath, 'utf-8');
    const match = tomlContent.match(/zekta_vault\s*=\s*"([^"]+)"/);
    if (!match) {
      throw new Error('Program ID not found in Anchor.toml');
    }
    return new PublicKey(match[1]);
  } catch (error) {
    console.error('Failed to read Program ID from Anchor.toml:', error);
    throw error;
  }
}

export async function initializeVaultClient(
  rpcUrl: string
): Promise<VaultClient> {
  const connection = new Connection(rpcUrl, 'confirmed');
  
  const relayerPrivateKey = process.env.SOLANA_PRIVATE_KEY_B58;
  if (!relayerPrivateKey) {
    throw new Error("SOLANA_PRIVATE_KEY_B58 environment variable is required for relayer");
  }

  const authorityKeypair = Keypair.fromSecretKey(bs58.decode(relayerPrivateKey));
  const programId = getProgramIdFromAnchorToml();

  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), authorityKeypair.publicKey.toBuffer()],
    programId
  );

  console.log('✓ Vault initialized');
  console.log(`  Vault Address: ${vaultPda.toBase58()}`);
  console.log(`  Program ID: ${programId.toBase58()}`);

  return {
    connection,
    authorityKeypair,
    programId,
    vaultPda,
    vaultBump
  };
}

export function deriveVaultPda(
  authorityPubkey: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), authorityPubkey.toBuffer()],
    programId
  );
}

export function deriveRootPda(
  vaultPda: PublicKey,
  merkleRootHash: Uint8Array,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('root'), vaultPda.toBuffer(), Buffer.from(merkleRootHash)],
    programId
  );
}

export function deriveDepositPda(
  vaultPda: PublicKey,
  commitmentHash: Uint8Array,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('deposit'), vaultPda.toBuffer(), Buffer.from(commitmentHash)],
    programId
  );
}

export function deriveNullifierPda(
  vaultPda: PublicKey,
  nullifierHash: Uint8Array,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('nullifier'), vaultPda.toBuffer(), Buffer.from(nullifierHash)],
    programId
  );
}

export async function getVaultBalance(
  connection: Connection,
  vaultPubkey: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(vaultPubkey);
  return balance / 1_000_000_000;
}

export function buildInitializeVaultInstruction(
  client: VaultClient
): TransactionInstruction {
  const discriminator = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);

  return new TransactionInstruction({
    keys: [
      { pubkey: client.vaultPda, isSigner: false, isWritable: true },
      { pubkey: client.authorityKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    programId: client.programId,
    data: discriminator
  });
}

export function buildDepositInstruction(
  client: VaultClient,
  depositor: PublicKey,
  commitmentHash: Uint8Array,
  amount: number
): TransactionInstruction {
  const [depositPda] = deriveDepositPda(
    client.vaultPda,
    commitmentHash,
    client.programId
  );

  const discriminator = Buffer.from([242, 35, 198, 137, 82, 225, 242, 182]);
  const commitmentData = Buffer.from(commitmentHash);
  const amountData = Buffer.alloc(8);
  amountData.writeBigUInt64LE(BigInt(amount), 0);

  const data = Buffer.concat([discriminator, commitmentData, amountData]);

  return new TransactionInstruction({
    keys: [
      { pubkey: depositPda, isSigner: false, isWritable: true },
      { pubkey: client.vaultPda, isSigner: false, isWritable: true },
      { pubkey: depositor, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    programId: client.programId,
    data
  });
}

export function buildWithdrawInstruction(
  client: VaultClient,
  nullifierHash: Uint8Array,
  merkleRootHash: Uint8Array,
  recipient: PublicKey,
  amount: number,
  payer: PublicKey
): TransactionInstruction {
  const [nullifierPda] = deriveNullifierPda(
    client.vaultPda,
    nullifierHash,
    client.programId
  );

  const [rootPda] = deriveRootPda(
    client.vaultPda,
    merkleRootHash,
    client.programId
  );

  const discriminator = Buffer.from([183, 18, 70, 156, 148, 109, 161, 34]);
  const nullifierData = Buffer.from(nullifierHash);
  const merkleRootData = Buffer.from(merkleRootHash);
  const amountData = Buffer.alloc(8);
  amountData.writeBigUInt64LE(BigInt(amount), 0);

  const data = Buffer.concat([discriminator, nullifierData, merkleRootData, amountData]);

  return new TransactionInstruction({
    keys: [
      { pubkey: nullifierPda, isSigner: false, isWritable: true },
      { pubkey: rootPda, isSigner: false, isWritable: false },
      { pubkey: client.vaultPda, isSigner: false, isWritable: true },
      { pubkey: client.authorityKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: recipient, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    programId: client.programId,
    data
  });
}

export function buildRegisterMerkleRootInstruction(
  client: VaultClient,
  merkleRootHash: Uint8Array
): TransactionInstruction {
  const [rootPda] = deriveRootPda(
    client.vaultPda,
    merkleRootHash,
    client.programId
  );

  const discriminator = Buffer.from([82, 104, 212, 41, 192, 235, 81, 84]);
  const merkleRootData = Buffer.from(merkleRootHash);

  const data = Buffer.concat([discriminator, merkleRootData]);

  return new TransactionInstruction({
    keys: [
      { pubkey: rootPda, isSigner: false, isWritable: true },
      { pubkey: client.vaultPda, isSigner: false, isWritable: false },
      { pubkey: client.authorityKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    programId: client.programId,
    data
  });
}

export async function transferFromVault(
  client: VaultClient,
  recipient: PublicKey,
  lamports: number
): Promise<string> {
  console.warn('transferFromVault is deprecated - use buildWithdrawInstruction instead');
  return 'stub-signature';
}
