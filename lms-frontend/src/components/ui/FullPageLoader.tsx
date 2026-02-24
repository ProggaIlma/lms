export default function FullPageLoader() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-full border-4 border-surface-200 border-t-primary-600 animate-spin" />
      <p className="text-sm text-surface-400 font-medium">Loading...</p>
    </div>
  );
}