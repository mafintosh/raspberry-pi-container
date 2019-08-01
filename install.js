#!/usr/bin/env node

const { spawn, exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const get = require('simple-get')
const pump = require('pump')
const prettier = require('prettier-bytes')
const diff = require('ansi-diff')()

const raspbian = process.env.RASPBIAN || 'https://downloads.raspberrypi.org/raspbian_lite_latest'
const dir = path.join(__dirname, 'raspbian')

exec('which qemu-arm-static', function (err, stdout) {
  const qemu = !err && stdout && stdout.toString().trim()
  if (!qemu) throw new Error('qemu-arm-static is required')

  exec('which systemd-nspawn', function (err, stdout) {
    if (err || !stdout) throw new Error('systemd-nspawn is required')
    clear()
    get(raspbian, function (err, res) {
      if (err || res.statusCode !== 200) throw new Error('Could not download raspbian')

      const total = parseInt(res.headers['content-length'], 10)
      let read = 0

      res.on('data', function (data) {
        read += data.length
        write('Downloading latest raspbian: ' + prettier(read) + ' / ' + prettier(total) + '\n')
      })

      pump(res, unzipper.Extract({ path: dir }), function (err) {
        if (err) throw err

        const img = fs.readdirSync(dir).filter(x => /\.img$/i.test(x))
        write('Latest raspbian: ' + img + '\n')
      })
    })
  })
})

function clear () {
  if (fs.existsSync(dir) === false) {
    return
  }
  fs.readdirSync(dir).forEach(function (name) {
    try {
      fs.unlinkSync(path.join(dir, name))
    } catch (err) {}
  })
}

function write (msg) {
  process.stdout.write(diff.update(msg))
}
