const krawler = require('../../lib')
const hooks = krawler.hooks
const path = require('path')
const fs = require('fs')
const makeDebug = require('debug')
const _ = require('lodash')

const config = require('./config')

const debug = makeDebug('krawler:examples')

// Configuration to get connected to secure Docker API
const dockerConfig = {
  host: '172.31.41.151',
  port: process.env.DOCKER_PORT || 2376,
  ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
  cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
  key: fs.readFileSync('/home/ubuntu/.docker/key.pem')
}

// Create a custom hook to generate tasks
let generateTasks = () => {
  return (hook) => {
    let tasks = []
    
    const width = 360 / config.grid.width
    const height = 180 / config.grid.height

    for (let i = 0; i < config.grid.width; i++) {
      for (let j = 0; j < config.grid.height; j++) {
        const minx = -180 + (i * width)
        const miny = -90 + (j * height)
        let task = {
          id: i + '-' + j,
          seed: {
            layer: config.layer,
            depth: config.depth,
            bbox: [minx, miny, minx + width, miny + height],
          },
          type: 'noop'
        }
        tasks.push(task)
      }
    }
    debug('Generated download tasks', tasks)
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', generateTasks)

module.exports = {
  id: 'seeder',
  store: 'output-store',
  options: {
    workersLimit: 4
  },
  hooks: {
    tasks: {
      before: {
      },
      after: {
        generateSeedFile: {
          hook: 'writeTemplate',
          dataPath: 'result',
          templateStore: 'template-store',
          templateFile: 'seed.yaml'
        },
        createContainer: {
          host: config.docker.host,
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
          cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
          key: fs.readFileSync('/home/ubuntu/.docker/key.pem'),
          Image: 'yagajs/mapproxy:1.11-alpine',
          Cmd: ['mapproxy-seed', '-f', '/mapproxy/mapproxy.yaml', '-s', '/mapproxy/<%= id %>.yaml'],
          HostConfig: {
            Binds: ['/home/ubuntu/krawler/examples/seeder/mapproxy:/mapproxy']
          },
          NetworkingConfig: {
            EndpointsConfig: {
              "kargo": {}
            }
          },
          Env: [ 'AWS_ACCESS_KEY_ID=' + process.env.S3_ACCESS_KEY, 
                 'AWS_SECRET_ACCESS_KEY=' + process.env.S3_SECRET_ACCESS_KEY ],
          AttachStdout: true,
          AttachStderr: true,
          Tty: true
        },
        startSeeder: {
          host: config.docker.host,
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
          cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
          key: fs.readFileSync('/home/ubuntu/.docker/key.pem'),
          hook: 'runContainerCommand',
          command: 'start',
        },
        removeSeeder: {
          host: config.docker.host,
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
          cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
          key: fs.readFileSync('/home/ubuntu/.docker/key.pem'),
          hook: 'runContainerCommand',
          command: 'remove',
          arguments: { force: true }
        }
      }
    },
    jobs: {
      before: {
        createStores: [
          {
            id: 'output-store',
            type: 'fs',
            storePath: 'output-store',
            options: { path: path.join(__dirname, '/mapproxy') }
          },
          {
            id: 'template-store',
            type: 'fs',
            storePath: 'template-store',
            options: { path: __dirname }
          }
        ],
        pullImage: {
          host: config.docker.host,
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
          cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
          key: fs.readFileSync('/home/ubuntu/.docker/key.pem'),
          image: 'yagajs/mapproxy:1.11-alpine'
        },
        generateTasks: {}
      },
      after: {
        removeStores: ['output-store', 'template-store']
      }
    }
  }
}