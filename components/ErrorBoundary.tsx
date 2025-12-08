import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-500">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Ops! Algo deu errado.</h1>
          <p className="text-slate-400 mb-6 max-w-xs">
            Ocorreu um erro inesperado na aplicação. Não se preocupe, seus dados estão seguros.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors"
          >
            <RefreshCw size={20} className="mr-2" />
            Recarregar App
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-8 p-4 bg-black/50 rounded text-xs text-left text-red-300 w-full overflow-auto max-w-sm">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}