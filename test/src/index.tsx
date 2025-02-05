// PlugSDK START
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

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

  sdk.modules.kso.on('ShareFileModal.shareLink.reset', props => {
    console.log('shareLink>>>>>>>>>', props)
    return props.fname + '\n' + props.addr
  })
}
// PlugSDK END
