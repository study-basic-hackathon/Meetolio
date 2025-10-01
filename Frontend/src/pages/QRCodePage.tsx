import "./QRCodePage.css";
import QRCode from "react-qr-code";

const QRCodePage: React.FC = () => {
  const url = "https://www.jbs.co.jp/";

  return (
    <div className="qr-page">
      <div className="qr-container">
        <QRCode value={url} size={220} />
      </div>
    </div>
  );
};

export default QRCodePage;
