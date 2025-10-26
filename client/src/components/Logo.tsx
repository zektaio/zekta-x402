interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`} data-testid="logo-container">
      <img 
        src="/logo.png" 
        alt="Zekta Logo" 
        className={`${sizes[size]} w-auto`}
        data-testid="logo-image"
      />
      {showText && (
        <span 
          className={`${textSizes[size]} font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent`}
          data-testid="logo-text"
        >
          ZEKTA
        </span>
      )}
    </div>
  );
}
