import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./shared/components/Header";
import { Layout } from "./shared/components/Layout";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const SitePage = lazy(() => import("./pages/SitePage").then(m => ({ default: m.SitePage })));

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div
          className="animate-spin inline-block w-8 h-8 border-2 border-t-transparent rounded-full mb-3"
          style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
        />
        <p style={{ color: "var(--text-secondary)" }}>加载中...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/site/:siteId/*" element={<SitePage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
