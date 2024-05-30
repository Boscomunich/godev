import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Progress: {
            circleTextFontSize:"0.75em",
            circleTextColor:"#fff",
          }
        },
      }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
