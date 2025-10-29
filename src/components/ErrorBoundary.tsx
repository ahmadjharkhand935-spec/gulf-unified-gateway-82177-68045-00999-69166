import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Surface for future logging if needed
    console.error("Unhandled error in React tree:", error, info);
  }

  handleReload = () => {
    if (navigator.serviceWorker) {
      // Try to bust SW caches aggressively to recover from bad caches
      caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n)))).finally(() => {
        location.reload();
      });
    } else {
      location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-6" dir="rtl">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-3">حدث خطأ غير متوقع</h1>
            <p className="text-sm text-muted-foreground mb-5">
              فضلاً أعد تحميل الصفحة. إذا استمرت المشكلة، امسح بيانات الموقع من المتصفح.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2"
            >
              إعادة التحميل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
