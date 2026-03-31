export const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-1">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">{title}</h1>
        {description && (
          <p className="text-sm text-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
