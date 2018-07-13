export const DEFAULT_VIRTUAL_SERVER_CONFIG = {
  kind: 'ConfigMap',
  apiVersion: 'v1',
  metadata: {
    name: '',
    namespace: '',
    labels: {
      f5type: 'virtual-server'
    }
  },
  data: {
    schema: 'f5schemadb://bigip-virtual-server_v0.1.7.json',
    data: {
      virtualServer: {
        frontend: {
          partition: '',
          virtualAddress: {
            bindAddr: '',
            port: ''
          },
          balance: 'round-robin',
          mode: 'tcp',
          sslProfile: {
            f5ProfileName: '',
            f5ProfileNames: ''
          }
        },
        backend: {
          serviceName: '',
          servicePort: '',
          healthMonitors: {
            protocol: '',
            interval: 5,
            timeout: 16,
            send: "GET /rn",
            recv: ''
          }
        }
      }
    }
  }
};

export const DEFAULT_IAPP_CONFIG = {
  kind: 'ConfigMap',
  apiVersion: 'v1',
  metadata: {
    name: '',
    namespace: '',
    labels: {
      f5type: 'iapp'
    }
  },
  data: {
    schema: 'f5schemadb://bigip-virtual-server_v0.1.7.json',
    data: {
      virtualServer:{
        frontend: {
          partition: '',
          iapp: '',
          iappPoolMemberTable: '',
          iappTables: '',
          iappOptions: '',
          iappVariables: ''
        },
        backend: {
          serviceName: '',
          servicePort: '',
          healthMonitors: {
            protocol: '',
            interval: 5,
            timeout: 16,
            send: "GET /rn",
            recv: ''
          }
        }
      }
    }
  }
};
