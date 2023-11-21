// src/components/status/index.tsx
import React from 'react'
import styled from 'styled-components'

interface iStatus {
  status?: string
  color?: string
}

const StatusComp = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: left;
  .status .status-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #000;
  }

  .status .status-icon.disconnected {
    background-color: red;
  }

  .status .status-icon.connected {
    background-color: green;
  }

  .status .status-text {
    margin-left: 5px;
  }
`

const Status: React.FC<iStatus> = ({ status, color }) => {
  return (
    <StatusComp className="status" style={{ color: `${color}` }}>
      <span className={`status-icon ${status}`}></span>
      <span className="status-text">{status}</span>
    </StatusComp>
  )
}
export { Status }