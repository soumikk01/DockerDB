'use client';

import { useState } from 'react';

interface ToggleRowProps {
  label: string;
  desc: string;
  defaultOn?: boolean;
}

function ToggleRow({ label, desc, defaultOn = false }: ToggleRowProps) {
  const [on, setOn] = useState(defaultOn);
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="ws-setting-row">
      <div className="ws-setting-row__info">
        <div className="ws-setting-row__label">{label}</div>
        <div className="ws-setting-row__desc">{desc}</div>
      </div>
      <label className="ws-toggle" htmlFor={id}>
        <input id={id} type="checkbox" checked={on} onChange={() => setOn(!on)} />
        <span className="ws-toggle__track" />
      </label>
    </div>
  );
}

export default function Settings() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Settings</h2>
        <p className="panel-header__desc">Application preferences and workspace configuration.</p>
      </div>

      {/* Editor Settings */}
      <div className="ws-settings-group">
        <div className="ws-settings-group__title">Editor</div>
        <ToggleRow label="Syntax Highlighting" desc="Color-code SQL keywords, types, and values in the query editor." defaultOn />
        <ToggleRow label="Auto-complete" desc="Suggest table names, column names, and SQL keywords as you type." defaultOn />
        <ToggleRow label="Show Row Numbers" desc="Display line numbers in the SQL editor gutter." defaultOn />
        <ToggleRow label="Auto-save Queries" desc="Automatically save open queries every 30 seconds." defaultOn />
        <ToggleRow label="Vim Keybindings" desc="Enable Vim-style navigation and editing shortcuts." />
      </div>

      {/* Query Settings */}
      <div className="ws-settings-group">
        <div className="ws-settings-group__title">Query Execution</div>
        <ToggleRow label="Confirm Destructive Queries" desc="Show a confirmation dialog before running DROP, TRUNCATE or DELETE statements." defaultOn />
        <ToggleRow label="Limit Result Rows" desc="Automatically add LIMIT 1000 to SELECT queries without a limit clause." defaultOn />
        <ToggleRow label="Show Query Duration" desc="Display execution time in the results panel after each query." defaultOn />
        <ToggleRow label="Auto-explain Plans" desc="Automatically show EXPLAIN output for slow queries." />
      </div>

      {/* Connection Settings */}
      <div className="ws-settings-group">
        <div className="ws-settings-group__title">Connection</div>
        <ToggleRow label="Keep-alive Pings" desc="Send periodic pings to prevent the database connection from timing out." defaultOn />
        <ToggleRow label="SSL Mode" desc="Require SSL/TLS for all database connections." />
        <ToggleRow label="Connection Pooling" desc="Use PgBouncer-style connection pooling for better performance." />
      </div>

      {/* Notifications */}
      <div className="ws-settings-group">
        <div className="ws-settings-group__title">Notifications</div>
        <ToggleRow label="Query Complete Alerts" desc="Show a notification when a long-running query finishes." defaultOn />
        <ToggleRow label="Error Toasts" desc="Show pop-up notifications when queries fail." defaultOn />
        <ToggleRow label="Backup Reminders" desc="Remind you to back up the database every 7 days." />
      </div>
    </div>
  );
}
