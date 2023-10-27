import i18next from "i18next";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const App = () => {
  const [langCode, setLangCode] = useState("kr");
  const { t } = useTranslation();

  const changeLang = () => {
    const newLangCode = langCode === "kr" ? "en" : "k r";
    i18next.changeLanguage(newLangCode);
    setLangCode(newLangCode);
  };

  return (
    <div>
      <button onClick={() => changeLang()}>언어토글</button>
      <div>현재 {langCode}</div>
      {t("NAME", { krNm: "카테고리", enNm: "category" })}
      {t("TOTAL_QTY", { totalQty: "1" })}
    </div>
  );
};

export default App;
