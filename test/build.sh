source /etc/profile
set -x
node -v
npm -v
npm config set strict-ssl false
npm config set registry  https://registry.npmmirror.com
SDK_DIST="/build"
SDK_CWD=$(cd "$(dirname "$0")"; pwd)
cd $SDK_CWD
export SDK_BUILD_PATH=$SDK_CWD$SDK_DIST
echo $SDK_BUILD_PATH
npm install --legacy-peer-deps
start_time=$(date +%s)
echo "yarn build..."
npm run build:ca
echo "yarn build done: $[$(date +%s)-$start_time]s"
