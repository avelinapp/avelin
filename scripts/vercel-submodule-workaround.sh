# github submodule repo address without https:// prefix
SUBMODULE_GITHUB=github.com/bazzalabs/static

# .gitmodules submodule path
SUBMODULE_PATH=../apps/web/static

# github access token is necessary
# add it to Environment Variables on Vercel
if [ "$GITHUB_BAZZALABS_RO_ACCESS_TOKEN" == "" ]; then
  echo "Error: GITHUB_BAZZALABS_RO_ACCESS_TOKEN is empty"
  exit 1
fi

# stop execution on error - don't let it build if something goes wrong
set -e

# get submodule commit
output=$(git submodule status --recursive) # get submodule info
no_prefix=${output#*-}                     # get rid of the prefix
COMMIT=${no_prefix% *}                     # get rid of the suffix

# set up an empty temporary work directory
TMP_PATH=../tmp
rm -rf $TMP_PATH || true # remove the tmp folder if exists
mkdir $TMP_PATH          # create the tmp folder
cd $TMP_PATH             # go into the tmp folder

# checkout the current submodule commit
git init                                                                          # initialise empty repo
git remote add origin https://$GITHUB_BAZZALABS_RO_ACCESS_TOKEN@$SUBMODULE_GITHUB # add origin of the submodule
git fetch --depth=1 origin $COMMIT                                                # fetch only the required version
git checkout $COMMIT                                                              # checkout on the right commit

# move the submodule from tmp to the submodule path
cd ..                           # go folder up
rm -rf $TMP_PATH/.git           # remove .git
mv $TMP_PATH/* $SUBMODULE_PATH/ # move the submodule to the submodule path

# clean up
rm -rf $TMP_PATH # remove the tmp folder
