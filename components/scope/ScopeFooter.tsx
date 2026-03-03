export default function ScopeFooter() {
  return (
    <footer className="border-t border-card-border py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-muted text-xs">
        <p>
          &copy; {new Date().getFullYear()} Geared Like A Machine. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
