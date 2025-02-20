export default function isDev(): boolean {
  return (window.electron.process.env?.NODE_ENV === "development");
}
