#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { execSync, spawnSync } = require('child_process')

const raspbian = path.join(__dirname, 'raspbian') 
const mount = path.join(require.resolve('mount-img/package.json'), '../index.sh')
const mnt = path.join(__dirname, 'raspberrypi')
const img = path.join(raspbian, fs.readdirSync(raspbian).filter(x => /\.img$/.test(x))[0])

const qemu = execSync('which qemu-arm-static').toString().trim()

spawnSync(mount, ['-p', '2', '-f', img, mnt], {
  stdio: 'inherit'
})

spawnSync('sudo', ['systemd-nspawn', '--bind', qemu, '-D', mnt].concat(process.argv.slice(2)), {
  stdio: 'inherit'
})

spawnSync('sudo', ['umount', '-f', mnt], {
  stdio: 'inherit'
})
