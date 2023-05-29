

const getMessage = ({state, errorReason}) => {
    const successMsg = {
        type: 'text',
        text: "成功！！  \n\n已經紀錄事件，時間到時將為您發送提醒通知",
    };
    const errorMsg = {
        type: 'text',
        text: `事件記錄失敗。  \n\n失敗原因：${errorReason}  \n\n嘗試以此範例格式輸入：2023-2-20-22-10-10/範例事件`,
    }
    return state ? successMsg : errorMsg
}

module.exports = getMessage