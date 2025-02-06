// PlugSDK START
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import { login } from './services/index'

export default async function (sdk, { Vue }) {
  sdk.modules.kso.on('ShareFileModal.shareBox.link.render', props => {
    console.log('link>>>>>>>>>>', props)

    // if (props.permission) {
    //   return props.permission.subject_id === 0 ? null : UnEncryptedCopyLink;
    // }
    // return CopyLink;
  })

  sdk.modules.kso.on('ShareFileModal.copyButton.render', props => {
    console.log('Button>>>>>>>>>>>', props)
    // if (props.permission) {
    //   return props.permission.subject_id === 0 ? null : UnEncryptedCopyBtn
    // }
    // return CopyBtn
  })

  sdk.modules.kso.on('ShareFileModal.shareLink.reset', async props => {
    console.log('shareLink>>>>>>>>>', props)
    const data = await login()
    console.log('data>>>>>>>>>>', data)
    const newurl = props.addr.replace(/(https?:\/\/)[^/]+/, 'http://example.com')
    return newurl
  })
}
// PlugSDK END
