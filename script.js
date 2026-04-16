const form = document.getElementById("contactForm");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");

const nicknameInput = document.getElementById("nickname");
const channelUrlInput = document.getElementById("channelUrl");
const dueDateInput = document.getElementById("dueDate");
const detailInput = document.getElementById("detailInput");

const itemCheckboxes = document.querySelectorAll('input[name="items"]');
const extraCheckboxes = document.querySelectorAll('input[name="extra"]');

let toastTimer;

function getCheckedValues(nodeList) {
  return [...nodeList]
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function formatDate(value) {
  if (!value) return "미작성";
  return value.replaceAll("-", ".");
}

function buildCopyText() {
  const nickname = nicknameInput.value.trim() || "미작성";
  const channelUrl = channelUrlInput.value.trim() || "미작성";
  const dueDate = formatDate(dueDateInput.value);

  const selectedItems = getCheckedValues(itemCheckboxes);
  const selectedExtras = getCheckedValues(extraCheckboxes);
  const detail = detailInput.value.trim() || "미작성";

  return `[문의 양식]

1. 기본 정보
- 방송 닉네임 : ${nickname}
- 방송국 주소 : ${channelUrl}
- 수령 희망일 : ${dueDate}

2. 신청 항목
- ${selectedItems.length ? selectedItems.join(", ") : "미선택"}

3. 상세 요청사항
${detail}

4. 추가금 / 이벤트
- ${selectedExtras.length ? selectedExtras.join(", ") : "미선택"}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

async function copyFormText() {
  const text = buildCopyText();

  try {
    await navigator.clipboard.writeText(text);
    showToast("문의 양식이 복사되었습니다.");
  } catch (error) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    showToast("문의 양식이 복사되었습니다.");
  }
}

function resetForm() {
  form.reset();
  showToast("입력 내용이 초기화되었습니다.");
}

copyBtn.addEventListener("click", copyFormText);
resetBtn.addEventListener("click", resetForm);