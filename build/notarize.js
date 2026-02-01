import 'dotenv/config.js'
import { notarize } from '@electron/notarize'

export default async function notarizing (context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') {
    return
  }

  // Skip notarization if credentials are not provided
  if (!process.env.APPLEID || !process.env.APPLEIDPASS) {
    console.log('Skipping notarization: Apple ID credentials not provided')
    return
  }

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    appBundleId: 'com.foxof7207.nook',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS
  })
}
