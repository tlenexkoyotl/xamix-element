language: node_js
sudo: false
dist: trusty
node_js: '9'
addons:
  firefox: latest
  chrome: stable
cache:
  directories:
  - node_modules
script:
- xvfb-run npm run test -- -l chrome
