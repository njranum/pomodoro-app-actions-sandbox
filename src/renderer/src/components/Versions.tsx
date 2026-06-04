import { useState } from 'react'

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
      <li className="app-version">App v{__APP_VERSION__}</li>
      <li className="build-commit">Build {__COMMIT_HASH__}</li>
      <li className="build-date">Built {new Date(__BUILD_DATE__).toLocaleDateString()}</li>
    </ul>
  )
}

export default Versions
