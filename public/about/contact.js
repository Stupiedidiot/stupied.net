const s_formId = '1FAIpQLSeQnKdsKZtLG_eX5ihnfUq_wlJ1wFI-h2O38XPNDkAAqUQaAQ';
const s_nameId = '1285632967';
const s_subjectId = '1233331611';
const s_addressId = '694860407';
const s_textId = '1882493386';

const s_maxLength = 10000;
const s_maxLengthName = 20;
const s_commentsOpen = false;
const s_closedCommentsText = "Currently not accepting any new messages.";

const s_nameFieldLabel = 'Name';
const s_subjectFieldLabel = 'Subject';
const s_addressFieldLabel = 'Email';
const s_imageFieldLabel = 'Image';
const s_textFieldLabel = '';
const s_submitButtonLabel = 'Submit';

const v_mainHtml = `
    <div id="c_inputDiv">
        <form id="c_form" onsubmit="c_submitButton.disabled = true; v_submitted = true;" method="post" target="c_hiddenIframe" action="https://docs.google.com/forms/d/e/${s_formId}/formResponse"></form>
    </div>
`;
const v_formHtml = `
    <div id="c_nameWrapper" class="c-inputWrapper">
        <label class="c-label c-nameLabel" for="entry.${s_nameId}">${s_nameFieldLabel}</label>
        <input class="c-input c-nameInput" name="entry.${s_nameId}" id="entry.${s_nameId}" type="text" maxlength="${s_maxLengthName}" placeholder="(Required) Name" onchange="checkPrev('userName')" required>
    </div>

    <div id="c_subjectWrapper" class="c-inputWrapper">
        <label class="c-label c-subjectLabel" for="entry.${s_subjectId}">${s_subjectFieldLabel}</label>
        <input class="c-input c-subjectInput" name="entry.${s_subjectId}" id="entry.${s_subjectId}" placeholder="(Required) Title" required>
    </div>

    <div id="c_addressWrapper" class="c-inputWrapper">
        <label class="c-label c-addressLabel" for="entry.${s_addressId}">${s_addressFieldLabel}</label>
        <input class="c-input c-addressInput" name="entry.${s_addressId}" id="entry.${s_addressId}" placeholder="(Optional) name@domain.com" title="Please specify what type of address this is">
    </div>

    <div id="c_textWrapper" class="c-inputWrapper">
        <label class="c-label c-textLabel" for="entry.${s_textId}">${s_textFieldLabel}</label>
        <textarea class="c-input c-textInput" name="entry.${s_textId}" id="entry.${s_textId}" rows="4" cols="50"  maxlength="${s_maxLength}" placeholder="Insert your message here!" required></textarea>
    </div>

    <input id="c_submitButton" name="c_submitButton" type="submit" value="${s_submitButtonLabel}" onclick="sent()" disabled>
`;

document.getElementById('contact_widget').innerHTML = v_mainHtml;
const c_form = document.getElementById('c_form');
if (s_commentsOpen) { c_form.innerHTML = v_formHtml }
else { c_form.innerHTML = `<div><h2>(>_<) So Sorry</h2> <p>${s_closedCommentsText}</p></div>` }

const c_container = document.getElementById('c_container');

let c_submitButton;
if (s_commentsOpen) { c_submitButton = document.getElementById('c_submitButton'); c_submitButton.disabled = false}
else { c_submitButton = document.createElement('button') }

let v_submitted = false;
let c_hiddenIframe = document.createElement('iframe');
c_hiddenIframe.id = 'c_hiddenIframe'; c_hiddenIframe.name = 'c_hiddenIframe'; c_hiddenIframe.style.display = 'none'; c_hiddenIframe.setAttribute('onload', 'if(v_submitted){fixFrame()}');
c_form.appendChild(c_hiddenIframe);
c_hiddenIframe = document.getElementById('c_hiddenIframe');

function fixFrame() {
    v_submitted = false;
    c_hiddenIframe.srcdoc = ''; 
    if (s_commentsOpen) {
        document.getElementById(`entry.${s_subjectId}`).value = '';
        document.getElementById(`entry.${s_textId}`).value = '';
    }
}


var userName = localStorage.getItem("userName");
if (s_commentsOpen === true) {
    if (userName !== null) {
        document.getElementById('entry.' + s_nameId).value = userName
    }
}

function checkPrev(item) {
    self = event.target
    if (self.value !== userName) {
        localStorage.setItem(item, self.value)
    }
}