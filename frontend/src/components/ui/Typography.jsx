const Typography = {
  Title: ({ children, className = "" }) => (
    <h1 className={`text-xl lg:text-2xl font-semibold text-gray-800 ${className}`}>
      {children}
    </h1>
  ),
  Subtitle: ({ children, className = "" }) => (
    <h2 className={`text-lg md:text-xl font-semibold text-gray-700 ${className}`}>
      {children}
    </h2>
  ),
  Label: ({ children, className = "" }) => (
    <label className={`text-sm font-medium text-gray-600 ${className}`}>
      {children}
    </label>
  ),
  Body: ({ children, className = "" }) => (
    <p className={`text-base text-gray-700 ${className}`}>
      {children}
    </p>
  ),
  Small: ({ children, className = "" }) => (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  ),
};

export default Typography;
