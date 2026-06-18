import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname; // Reload the clean path
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-screen" className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-stone-800 tracking-tight">앱을 불러오는 중 문제가 발생했습니다</h1>
          <p className="text-xs text-stone-500 mt-2.5 max-w-xs leading-relaxed">
            네트워크 연결이 불안정하거나 임시 오류가 발생했을 수 있습니다. 아래 버튼을 눌러 다시 시도해보세요.
          </p>
          
          {this.state.error && (
            <div className="mt-4 p-3 bg-stone-100 rounded-lg max-w-sm text-left overflow-auto max-h-32 border border-stone-200">
              <code className="text-[10px] text-stone-600 font-mono break-all whitespace-pre-wrap">
                {this.state.error.stack || this.state.error.message}
              </code>
            </div>
          )}

          <button
            id="error-boundary-retry-btn"
            onClick={this.handleRetry}
            className="mt-6 px-6 py-2.5 bg-[#E85C28] hover:bg-[#cf4e1e] text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-md cursor-pointer active:scale-95"
          >
            다시 시도하기
          </button>
        </div>
      );
    }

    return this.children;
  }
}
