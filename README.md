# raspberry-pi-container

A systemd-nspawn raspberry pi container.

Uses qemu-arm-static to emulate arm7 on any Linux host

```sh
npm install -g raspberry-pi-container
raspberry-pi-container # drops you in a raspbian shell so you can compile / test things on arm
```

## Dependencies

Requires systemd-nspawn (Linux) and qemu-arm-static which can usually be installed by your package manager.

Fell free to PR specific install instructions per platform.

## License

MIT
