module.exports = {
  forbidden: [
    {
      name: 'no-core-to-app',
      comment: 'Core layer should not depend on app layer',
      severity: 'error',
      from: { path: '^core' },
      to: { path: '^app' }
    },
    {
      name: 'no-core-to-node',
      comment: 'Core layer should only use shared and core modules',
      severity: 'error',
      from: { path: '^core' },
      to: { pathNot: '^(shared|core)' }
    },
    {
      name: 'no-shared-to-app',
      comment: 'Shared utilities should not depend on app layer',
      severity: 'warn',
      from: { path: '^shared' },
      to: { path: '^app' }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.base.json'
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      }
    }
  }
};