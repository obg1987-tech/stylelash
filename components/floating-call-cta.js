"use client";

import { useState } from "react";

const PHONE_NUMBER = "0507-1405-3087";
const PHONE_HREF = "tel:050714053087";

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || "";
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
}

export default function FloatingCallCta() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (event) => {
    if (isMobileDevice()) return;
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <a href={PHONE_HREF} className="floating-cta" aria-label="전화 문의하기" onClick={handleClick}>
        전화 문의하기
      </a>

      {isOpen ? (
        <div className="call-modal-backdrop" role="dialog" aria-modal="true" aria-label="전화 문의 안내">
          <div className="call-modal">
            <p className="call-modal-eyebrow">Call Guide</p>
            <h3>데스크톱에서는 바로 통화 연결이 어려워요.</h3>
            <p>
              모바일에서 버튼을 누르거나
              <br />
              <strong>{PHONE_NUMBER}</strong>로 문의해 주세요.
            </p>
            <button type="button" onClick={() => setIsOpen(false)}>
              확인
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

