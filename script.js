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

const signatureBalloonCheck = document.getElementById("signatureBalloonCheck");
const signatureBalloonQty = document.getElementById("signatureBalloonQty");

let toastTimer;

function getCheckedValues(nodeList) {
  const values = [];

  [...nodeList].forEach((input) => {
    if (!input.checked) return;

    if (input.value === "시그니처 풍선") {
      const rawQty = parseInt(signatureBalloonQty.value || "0", 10);
      const qty = Number.isNaN(rawQty) ? 0 : Math.max(0, rawQty);
      values.push(`시그니처 풍선 ${qty}개`);
      return;
    }

    values.push(input.value);
  });

  return values;
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
- ${selectedExtras.length ? selectedExtras.join(", ") : "미선택"}

※ 평균 작업일은 7~14일이며 빠른 마감은 불가능합니다.`;
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

  if (signatureBalloonQty) {
    signatureBalloonQty.value = 0;
  }

  showToast("입력 내용이 초기화되었습니다.");
}

if (signatureBalloonQty) {
  signatureBalloonQty.addEventListener("input", (event) => {
    const input = event.target;
    const sanitized = input.value.replace(/[^\d]/g, "");

    if (sanitized === "") {
      input.value = "";
      return;
    }

    input.value = String(Math.max(0, parseInt(sanitized, 10)));
  });

  signatureBalloonQty.addEventListener("blur", () => {
    if (signatureBalloonQty.value === "") {
      signatureBalloonQty.value = "0";
    }
  });
}

copyBtn.addEventListener("click", copyFormText);
resetBtn.addEventListener("click", resetForm);