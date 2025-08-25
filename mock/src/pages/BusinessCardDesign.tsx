import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Profile } from "../types";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Transformer,
  Circle,
  Line,
  Group,
} from "react-konva";
import Konva from "konva";
import "./BusinessCardDesign.css";

interface TextElement {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  width: number;
  align: string;
  draggable: boolean;
  textStyle?: "heading" | "subheading" | "body";
}

interface ShapeElement {
  id: string;
  type: "rect" | "circle" | "line";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  draggable: boolean;
}

interface IconElement {
  id: string;
  type: "icon";
  iconType: string;
  x: number;
  y: number;
  size: number;
  fill: string;
  draggable: boolean;
}

type DesignElement = TextElement | ShapeElement | IconElement;

const BusinessCardDesign: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front");
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [currentTool, setCurrentTool] = useState<
    "select" | "text" | "rect" | "circle" | "line" | "icon"
  >("select");
  const [showGrid, setShowGrid] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [history, setHistory] = useState<DesignElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showTextModal, setShowTextModal] = useState(false);
  const [selectedTextStyle, setSelectedTextStyle] = useState<
    "heading" | "subheading" | "body"
  >("body");
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    elementId: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    elementId: "",
  });

  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // モックプロフィールデータを取得
    const mockProfile: Profile = {
      id: "1",
      userId: user?.id || "1",
      name: user?.name || "田中太郎",
      company: "テック株式会社",
      jobTitle: "フロントエンドエンジニア",
      bio: "Web開発に携わって5年目です。React、TypeScript、Node.jsを中心に開発を行っています。ユーザビリティを重視した設計を心がけています。",
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "CSS",
        "HTML",
        "JavaScript",
        "Git",
        "AWS",
      ],
      interests: ["プログラミング", "読書", "旅行", "料理", "音楽"],
      contactInfo: {
        email: "taro.tech@example.com",
        phone: "090-1234-5678",
        sns: {
          twitter: "taro_tech",
          linkedin: "taro-tech",
          github: "taro-tech",
          instagram: "taro_tech_dev",
        },
        website: "https://taro-tech.dev",
      },
      isPublic: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    };

    setProfile(mockProfile);
    setIsLoading(false);
  }, [isAuthenticated, user, navigate]);

  // 初期テキスト要素を設定
  useEffect(() => {
    if (profile) {
      const initialElements: DesignElement[] =
        currentSide === "front"
          ? [
              {
                id: "company",
                type: "text",
                text: profile.company || "会社名",
                x: 200,
                y: 60,
                fontSize: 18,
                fontFamily: "Arial",
                fill: "#000000",
                width: 400,
                align: "center",
                draggable: true,
                textStyle: "heading",
              },
              {
                id: "jobTitle",
                type: "text",
                text: profile.jobTitle || "役職",
                x: 200,
                y: 90,
                fontSize: 14,
                fontFamily: "Arial",
                fill: "#666666",
                width: 400,
                align: "center",
                draggable: true,
                textStyle: "subheading",
              },
              {
                id: "name",
                type: "text",
                text: profile.name || "氏名",
                x: 200,
                y: 120,
                fontSize: 16,
                fontFamily: "Arial",
                fill: "#000000",
                width: 400,
                align: "center",
                draggable: true,
                textStyle: "body",
              },
            ]
          : [
              {
                id: "email",
                type: "text",
                text: profile.contactInfo.email || "メールアドレス",
                x: 200,
                y: 80,
                fontSize: 12,
                fontFamily: "Arial",
                fill: "#000000",
                width: 400,
                align: "center",
                draggable: true,
                textStyle: "body",
              },
              {
                id: "phone",
                type: "text",
                text: profile.contactInfo.phone || "電話番号",
                x: 200,
                y: 110,
                fontSize: 12,
                fontFamily: "Arial",
                fill: "#000000",
                width: 400,
                align: "center",
                draggable: true,
                textStyle: "body",
              },
              {
                id: "website",
                type: "text",
                text: profile.contactInfo.website || "ウェブサイト",
                x: 200,
                y: 140,
                fontSize: 12,
                fontFamily: "Arial",
                fill: "#000000",
                width: 400,
                align: "center",
                draggable: true,
                textStyle: "body",
              },
            ];

      setElements(initialElements);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      addToHistory(initialElements);
    }
  }, [profile, currentSide, user]);

  // 選択された要素のTransformerを更新
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const node = stageRef.current?.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedId]);

  // 履歴管理
  const addToHistory = (newElements: DesignElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements([...history[newIndex]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements([...history[newIndex]]);
    }
  };

  const moveElement = (id: string, direction: "forward" | "backward") => {
    const newElements = [...elements];
    const currentIndex = newElements.findIndex((el) => el.id === id);

    if (direction === "forward" && currentIndex < newElements.length - 1) {
      [newElements[currentIndex], newElements[currentIndex + 1]] = [
        newElements[currentIndex + 1],
        newElements[currentIndex],
      ];
    } else if (direction === "backward" && currentIndex > 0) {
      [newElements[currentIndex], newElements[currentIndex - 1]] = [
        newElements[currentIndex - 1],
        newElements[currentIndex],
      ];
    }

    setElements(newElements);
    addToHistory(newElements);
  };

  const alignElements = (
    alignment: "left" | "center" | "right" | "top" | "middle" | "bottom"
  ) => {
    if (selectedId) {
      const selectedElement = elements.find((el) => el.id === selectedId);
      if (!selectedElement) return;

      const newElements = elements.map((el) => {
        if (el.id === selectedId) {
          const newEl = { ...el };
          switch (alignment) {
            case "left":
              newEl.x = 50;
              break;
            case "center":
              newEl.x = 200;
              break;
            case "right":
              newEl.x = 350;
              break;
            case "top":
              newEl.y = 50;
              break;
            case "middle":
              newEl.y = 121;
              break;
            case "bottom":
              newEl.y = 192;
              break;
          }
          return newEl;
        }
        return el;
      });

      setElements(newElements);
      addToHistory(newElements);
    }
  };

  const handleTextClick = (id: string, event: any) => {
    setSelectedId(id);

    // コンテキストメニューの位置を計算
    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    // Konvaステージの左上にコンテキストメニューを配置
    // canvas-wrapperの位置を考慮して座標を計算
    const canvasWrapper = document.querySelector(".canvas-wrapper");
    if (canvasWrapper) {
      const rect = canvasWrapper.getBoundingClientRect();
      setContextMenu({
        visible: true,
        x: rect.left + 10, // canvas-wrapperの左上から10px右
        y: rect.top + 10, // canvas-wrapperの左上から10px下
        elementId: id,
      });
    } else {
      // フォールバック: 固定位置
      setContextMenu({
        visible: true,
        x: 10,
        y: 10,
        elementId: id,
      });
    }
  };

  const handleTextEdit = (id: string, newText: string) => {
    const newElements = elements.map((el) =>
      el.id === id && el.type === "text" ? { ...el, text: newText } : el
    );
    setElements(newElements);
    addToHistory(newElements);
    setEditingText("");
  };

  const handleElementUpdate = (id: string, updates: any) => {
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const handleAddText = (style: "heading" | "subheading" | "body" = "body") => {
    let fontSize = 16;
    let y = 100;

    switch (style) {
      case "heading":
        fontSize = 24;
        y = 80;
        break;
      case "subheading":
        fontSize = 18;
        y = 110;
        break;
      case "body":
        fontSize = 14;
        y = 140;
        break;
    }

    const newText: TextElement = {
      id: `text-${Date.now()}`,
      type: "text",
      text:
        style === "heading"
          ? "見出し"
          : style === "subheading"
          ? "小見出し"
          : "本文",
      x: 200,
      y: y,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: textColor,
      width: 400,
      align: "center",
      draggable: true,
      textStyle: style,
    };
    const newElements = [...elements, newText];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(newText.id);
    setShowTextModal(true);
  };

  const handleAddShape = (shapeType: "rect" | "circle" | "line") => {
    let newShape: ShapeElement;

    switch (shapeType) {
      case "rect":
        newShape = {
          id: `rect-${Date.now()}`,
          type: "rect",
          x: 100,
          y: 100,
          width: 100,
          height: 60,
          fill: textColor,
          stroke: "#000000",
          strokeWidth: 2,
          draggable: true,
        };
        break;
      case "circle":
        newShape = {
          id: `circle-${Date.now()}`,
          type: "circle",
          x: 150,
          y: 150,
          radius: 30,
          fill: textColor,
          stroke: "#000000",
          strokeWidth: 2,
          draggable: true,
        };
        break;
      case "line":
        newShape = {
          id: `line-${Date.now()}`,
          type: "line",
          x: 100,
          y: 100,
          points: [0, 0, 100, 0],
          fill: "#000000",
          stroke: "#000000",
          strokeWidth: 2,
          draggable: true,
        };
        break;
    }

    const newElements = [...elements, newShape];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(newShape.id);
  };

  const handleAddIcon = (iconType: string) => {
    const newIcon: IconElement = {
      id: `icon-${Date.now()}`,
      type: "icon",
      iconType,
      x: 100,
      y: 100,
      size: 24,
      fill: textColor,
      draggable: true,
    };

    const newElements = [...elements, newIcon];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(newIcon.id);
  };

  const handleDeleteElement = () => {
    if (selectedId) {
      const newElements = elements.filter((el) => el.id !== selectedId);
      setElements(newElements);
      addToHistory(newElements);
      setSelectedId(null);
    }
  };

  const handleSave = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("名刺デザインを保存しました");
      console.log("現在の要素:", elements);
      navigate("/business-card/edit");
    } catch (error) {
      console.error("名刺デザインの保存に失敗しました:", error);
    }
  };

  const handleCancel = () => {
    navigate("/business-card/edit");
  };

  const handleExportImage = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      const link = document.createElement("a");
      link.download = `business-card-${currentSide}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const renderElement = (element: DesignElement) => {
    switch (element.type) {
      case "text":
        return (
          <Text
            key={element.id}
            id={element.id}
            text={element.text}
            x={element.x}
            y={element.y}
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
            fill={element.fill}
            align={element.align as any}
            width={element.width}
            draggable={element.draggable}
            onClick={(e) => handleTextClick(element.id, e)}
            onTap={(e) => handleTextClick(element.id, e)}
            onDragEnd={(e) => {
              handleElementUpdate(element.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        );
      case "rect":
        return (
          <Rect
            key={element.id}
            id={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            draggable={element.draggable}
            onClick={() => setSelectedId(element.id)}
            onTap={() => setSelectedId(element.id)}
            onDragEnd={(e) => {
              handleElementUpdate(element.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        );
      case "circle":
        return (
          <Circle
            key={element.id}
            id={element.id}
            x={element.x}
            y={element.y}
            radius={element.radius}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            draggable={element.draggable}
            onClick={() => setSelectedId(element.id)}
            onTap={() => setSelectedId(element.id)}
            onDragEnd={(e) => {
              handleElementUpdate(element.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        );
      case "line":
        return (
          <Line
            key={element.id}
            id={element.id}
            x={element.x}
            y={element.y}
            points={element.points}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            draggable={element.draggable}
            onClick={() => setSelectedId(element.id)}
            onTap={() => setSelectedId(element.id)}
            onDragEnd={(e) => {
              handleElementUpdate(element.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        );
      case "icon":
        return (
          <Group
            key={element.id}
            id={element.id}
            x={element.x}
            y={element.y}
            draggable={element.draggable}
            onClick={() => setSelectedId(element.id)}
            onTap={() => setSelectedId(element.id)}
            onDragEnd={(e) => {
              handleElementUpdate(element.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          >
            {element.iconType === "phone" && (
              <Rect
                x={0}
                y={0}
                width={element.size}
                height={element.size * 1.6}
                fill={element.fill}
              />
            )}
            {element.iconType === "email" && (
              <Rect
                x={0}
                y={0}
                width={element.size}
                height={element.size * 0.8}
                fill={element.fill}
              />
            )}
            {element.iconType === "website" && (
              <Circle
                x={element.size / 2}
                y={element.size / 2}
                radius={element.size / 2}
                fill={element.fill}
              />
            )}
          </Group>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="business-card-design">
        <div className="container">
          <div className="loading">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="business-card-design">
        <div className="container">
          <div className="error">プロフィールが見つかりません</div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-card-design">
      <div className="container">
        <div className="design-header">
          <h1>名刺デザイン</h1>
          <p>名刺の表面・裏面をデザインできます</p>
        </div>

        <div className="design-container">
          {/* サイド選択タブ */}
          <div className="side-tabs">
            <button
              className={`side-tab ${currentSide === "front" ? "active" : ""}`}
              onClick={() => setCurrentSide("front")}
            >
              表面
            </button>
            <button
              className={`side-tab ${currentSide === "back" ? "active" : ""}`}
              onClick={() => setCurrentSide("back")}
            >
              裏面
            </button>
          </div>

          {/* 描画エリア */}
          <div className="canvas-container">
            <div className="canvas-wrapper">
              <Stage
                ref={stageRef}
                width={400}
                height={242}
                onMouseDown={(e) => {
                  if (e.target === e.target.getStage()) {
                    setSelectedId(null);
                    setContextMenu({ ...contextMenu, visible: false });
                  }
                }}
              >
                <Layer>
                  {/* 背景 */}
                  <Rect
                    x={0}
                    y={0}
                    width={400}
                    height={242}
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />

                  {/* グリッド */}
                  {showGrid && (
                    <>
                      {Array.from({ length: 20 }, (_, i) => (
                        <Line
                          key={`grid-v-${i}`}
                          x={i * 20}
                          y={0}
                          points={[0, 0, 0, 242]}
                          stroke="#f0f0f0"
                          strokeWidth={1}
                        />
                      ))}
                      {Array.from({ length: 13 }, (_, i) => (
                        <Line
                          key={`grid-h-${i}`}
                          x={0}
                          y={i * 20}
                          points={[0, 0, 400, 0]}
                          stroke="#f0f0f0"
                          strokeWidth={1}
                        />
                      ))}
                    </>
                  )}

                  {/* ガイドライン */}
                  {showGuidelines && (
                    <>
                      <Line
                        x={200}
                        y={0}
                        points={[0, 0, 0, 242]}
                        stroke="#3b82f6"
                        strokeWidth={1}
                        dash={[5, 5]}
                      />
                      <Line
                        x={0}
                        y={121}
                        points={[0, 0, 400, 0]}
                        stroke="#3b82f6"
                        strokeWidth={1}
                        dash={[5, 5]}
                      />
                    </>
                  )}

                  {/* デザイン要素 */}
                  {elements.map(renderElement)}

                  {/* Transformer */}
                  {selectedId && <Transformer ref={transformerRef} />}
                </Layer>
              </Stage>
            </div>
          </div>

          {/* 下部ツールバー */}
          <div className="bottom-toolbar">
            <div className="toolbar-scroll">
              <div
                className="toolbar-item"
                onClick={() => setCurrentTool("select")}
              >
                <div className="toolbar-icon">✋</div>
                <div className="toolbar-label">選択</div>
              </div>
              <div
                className="toolbar-item"
                onClick={() => handleAddText("heading")}
              >
                <div className="toolbar-icon">T</div>
                <div className="toolbar-label">テキスト</div>
              </div>
              <div
                className="toolbar-item"
                onClick={() => handleAddShape("rect")}
              >
                <div className="toolbar-icon">□</div>
                <div className="toolbar-label">図形</div>
              </div>
              <div
                className="toolbar-item"
                onClick={() => handleAddIcon("phone")}
              >
                <div className="toolbar-icon">📞</div>
                <div className="toolbar-label">アイコン</div>
              </div>
              <div
                className={`toolbar-item ${
                  historyIndex <= 0 ? "disabled" : ""
                }`}
                onClick={historyIndex > 0 ? undo : undefined}
              >
                <div className="toolbar-icon">↶</div>
                <div className="toolbar-label">戻る</div>
              </div>
              <div
                className={`toolbar-item ${
                  historyIndex >= history.length - 1 ? "disabled" : ""
                }`}
                onClick={historyIndex < history.length - 1 ? redo : undefined}
              >
                <div className="toolbar-icon">↷</div>
                <div className="toolbar-label">進む</div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="design-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              デザインを保存
            </button>
          </div>
        </div>
      </div>

      {/* テキスト編集モーダル */}
      {showTextModal && (
        <div className="modal-overlay" onClick={() => setShowTextModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>テキスト編集</h3>
              <button
                className="modal-close"
                onClick={() => setShowTextModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="search-section">
                <div className="search-bar">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="フォントと組み合わせを検索"
                    className="search-input"
                  />
                </div>
              </div>

              <div className="text-options">
                <button
                  className="text-option-btn primary"
                  onClick={() => handleAddText("heading")}
                >
                  <span className="text-icon">T</span>
                  <span className="text-label">見出しを追加</span>
                </button>

                <button
                  className="text-option-btn secondary"
                  onClick={() => handleAddText("subheading")}
                >
                  <span className="text-icon">T</span>
                  <span className="text-label">小見出しを追加</span>
                </button>

                <button
                  className="text-option-btn secondary"
                  onClick={() => handleAddText("body")}
                >
                  <span className="text-icon">T</span>
                  <span className="text-label">本文を追加</span>
                </button>
              </div>

              {selectedId && (
                <div className="text-editor-section">
                  <h4>テキスト編集</h4>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => handleTextEdit(selectedId, editingText)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleTextEdit(selectedId, editingText);
                      }
                    }}
                    placeholder="テキストを入力"
                    className="text-input"
                  />

                  <div className="style-controls">
                    <label>
                      フォントサイズ:
                      <input
                        type="range"
                        min="8"
                        max="48"
                        value={fontSize}
                        onChange={(e) => {
                          setFontSize(Number(e.target.value));
                          if (selectedId) {
                            const element = elements.find(
                              (el) => el.id === selectedId
                            );
                            if (element && element.type === "text") {
                              handleElementUpdate(selectedId, {
                                fontSize: Number(e.target.value),
                              });
                            }
                          }
                        }}
                        className="font-size-slider"
                      />
                      <span>{fontSize}px</span>
                    </label>

                    <label>
                      フォント:
                      <select
                        value={fontFamily}
                        onChange={(e) => {
                          setFontFamily(e.target.value);
                          if (selectedId) {
                            const element = elements.find(
                              (el) => el.id === selectedId
                            );
                            if (element && element.type === "text") {
                              handleElementUpdate(selectedId, {
                                fontFamily: e.target.value,
                              });
                            }
                          }
                        }}
                        className="font-family-select"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                      </select>
                    </label>

                    <label>
                      色:
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value);
                          if (selectedId) {
                            handleElementUpdate(selectedId, {
                              fill: e.target.value,
                            });
                          }
                        }}
                        className="color-picker"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* コンテキストメニュー */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: "absolute",
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 1000,
          }}
        >
          <button
            className="context-menu-btn edit-btn"
            onClick={() => {
              const element = elements.find(
                (el) => el.id === contextMenu.elementId
              );
              if (element && element.type === "text") {
                setEditingText(element.text);
                setSelectedTextStyle(element.textStyle || "body");
                setShowTextModal(true);
              }
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            ✏️
          </button>
          <button
            className="context-menu-btn delete-btn"
            onClick={() => {
              const newElements = elements.filter(
                (el) => el.id !== contextMenu.elementId
              );
              setElements(newElements);
              addToHistory(newElements);
              setSelectedId(null);
              // Transformerをクリア
              if (transformerRef.current) {
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer()?.batchDraw();
              }
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessCardDesign;
