import React, { useState, useRef ,useEffect} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GlobalSidebar from './GlobalSidebar';
import FlashControlPanel from './FlashControlPanel';
import DefaultNavbar from './DefaultNavbar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';

const MainLayout = ({ fileSystem, onFileSystemUpdate, refreshFileSystem }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [flashingState, setFlashingState] = useState({
    progress: 0,
    elapsedTime: '0s',
    estimatedTime: 'N/A',
    deviceInfo: null,
    isFlashing: false,
    isPaused: false,
  });
  const timerRef = useRef(null);
  const editorRef = useRef(null);
  const flowchartRef = useRef(null);
  const blockDiagramRef = useRef(null);
  const [device, setDevice] = useState(null);
  const [deviceError, setDeviceError] = useState('');
  const location = useLocation();

  // Editor State
  const [tabs, setTabs] = useState([{ id: 1, name: "Tab 1", content: "" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [language, setLanguage] = useState("Select Language");
  const [activeView, setActiveView] = useState('output'); // 'output', 'serial', 'terminal'

  const startFlashing = () => {
    clearInterval(timerRef.current);
    setFlashingState({
      progress: 0,
      elapsedTime: '0s',
      estimatedTime: 'N/A',
      isFlashing: true,
      isPaused: false,
    });

    const duration = 5000; // 5 seconds
    const interval = 200;
    let elapsedTime = 0;

    timerRef.current = setInterval(() => {
      setFlashingState(prevState => {
        if (prevState.isPaused || !prevState.isFlashing) {
          return prevState;
        }
        elapsedTime += interval;
        const progress = Math.min(100, (elapsedTime / duration) * 100);

        if (progress >= 100) {
          clearInterval(timerRef.current);
          return { ...prevState, progress: 100, isFlashing: false };
        }

        return {
          ...prevState,
          progress: progress,
          elapsedTime: `${(elapsedTime / 1000).toFixed(1)}s`,
          estimatedTime: `${((duration - elapsedTime) / 1000).toFixed(1)}s`,
        };
      });
    }, interval);
  };

  const handleAbort = () => {
    clearInterval(timerRef.current);
    setFlashingState(prev => ({ ...prev, isFlashing: false }));
  };

  const handlePause = () => {
    setFlashingState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleRestart = () => {
    startFlashing();
  };

  // Editor Handlers
  const handleEditorChange = (newValue) => {
    setTabs(
        tabs.map((tab) =>
            tab.id === activeTab ? { ...tab, content: newValue } : tab
        )
    );
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    // The CODE_SNIPPETS constant is not available here, so we'll just change the language
    // and let the user type the code.
  };

  const addNewTab = () => {
    if (tabs.length >= 5) {
        alert(`Maximum of 5 tabs allowed.`);
        return;
    }
    const newTabId = tabs.length > 0 ? Math.max(...tabs.map(t => t.id)) + 1 : 1;
    const newTab = { id: newTabId, name: `Tab ${newTabId}`, content: "" };
    setTabs([...tabs, newTab]);
    setActiveTab(newTabId);
  };

  const closeTab = (tabId, event) => {
    event.stopPropagation();
    let newTabs = tabs.filter((tab) => tab.id !== tabId);
    if (newTabs.length === 0) {
        const defaultTab = { id: 1, name: "Tab 1", content: "" };
        newTabs = [defaultTab];
        setActiveTab(defaultTab.id);
    } else {
        if (activeTab === tabId) {
            setActiveTab(newTabs[newTabs.length - 1].id);
        }
    }
    setTabs(newTabs);
  };

  // Tool Handlers
  const handleCompile = () => alert('Compile action triggered!');
  const handleBuild = () => alert('Build action triggered!');
  const handleDebugger = () => alert('Debugger action triggered!');
  const handleEraseChip = () => alert('Erase Chip action triggered!');

  const handleFlash = () => {
    if (!device) {
        alert('Device not found. Please ensure the device is connected.');
        return;
    }
    startFlashing();
  };

  const handleSerialMonitor = () => {
    setActiveView('serial');
  };

  const handleTerminal = () => {
    setActiveView('terminal');
  };

  const handleLoadJson = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleEditorChange(e.target.result);
      };
      reader.readAsText(file);
    }
  };


  const handleExportJson = () => {
    // This event is listened to by DiagramEditor.jsx to trigger the save
    window.dispatchEvent(new CustomEvent('save-json'));
  };

  const handleExportPng = () => {
    let targetRef;
    let fileName = 'export.png';

    switch (location.pathname) {
      case '/embedded':
        targetRef = editorRef;
        fileName = 'code.png';
        break;
      case '/diagram-editor':
      case '/blockdiagram':
        targetRef = flowchartRef; // Both routes use the same ref
        fileName = location.pathname === '/diagram-editor' ? 'flowchart.png' : 'blockdiagram.png';
        break;
      default:
        alert('No active view to export.');
        return;
    }

    if (targetRef && targetRef.current) {
      const captureTarget = targetRef.current.querySelector('.react-flow__viewport') || targetRef.current;

      toPng(captureTarget, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      })
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Draw watermark
            const watermarkText = 'made with innotrat labs';
            ctx.font = '14px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';

            const padding = 20;
            const textMetrics = ctx.measureText(watermarkText);
            const textX = canvas.width - padding;
            const textY = canvas.height - padding;
            ctx.fillText(watermarkText, textX, textY);

            // Draw InnoTrat symbol (hexagon)
            const symbolSize = 8;
            const symbolX = textX - textMetrics.width - 10;
            const symbolY = textY - symbolSize / 2 - 2;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              ctx.lineTo(
                symbolX + symbolSize * Math.cos((Math.PI / 3) * i),
                symbolY + symbolSize * Math.sin((Math.PI / 3) * i)
              );
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.stroke();

            const finalUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = finalUrl;
            a.download = fileName;
            a.click();
          };
        })
        .catch((err) => {
          console.error('Failed to export diagram:', err);
          alert('An error occurred while exporting the diagram.');
        });

    } else {
      alert('Could not find the content to export.');
    }
  };

  useEffect(() => {
    if (!('serial' in navigator)) {
        setDeviceError('Web Serial API not supported in this browser.');
        return;
    }

    const checkPorts = async () => {
        const ports = await navigator.serial.getPorts();
        if (ports.length > 0) {
            setDevice(ports[0]);
        }
    };

    checkPorts();

    const handleConnect = (e) => setDevice(e.port);
    const handleDisconnect = (e) => {
        if (device === e.port) {
            setDevice(null);
        }
    };

    navigator.serial.addEventListener('connect', handleConnect);
    navigator.serial.addEventListener('disconnect', handleDisconnect);

    return () => {
        navigator.serial.removeEventListener('connect', handleConnect);
        navigator.serial.removeEventListener('disconnect', handleDisconnect);
    };
  }, [device]);

  const handleConnectClick = async () => {
      try {
          const port = await navigator.serial.requestPort();
          setDevice(port);
      } catch (err) {
          setDeviceError('No device selected or an error occurred.');
          console.error(err);
      }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <DefaultNavbar 
        onLoad={handleLoadJson}
        onExportJson={handleExportJson}
        onExportPng={handleExportPng}
        onCompile={handleCompile}
        onBuild={handleBuild}
        onDebugger={handleDebugger}
        onFlash={handleFlash}
        onEraseChip={handleEraseChip}
        onSerialMonitor={handleSerialMonitor}
        onTerminal={handleTerminal}
      />
      <div className="flex flex-1 overflow-hidden">
        {flashingState.isFlashing && (
          <FlashControlPanel
            progress={flashingState.progress}
            elapsedTime={flashingState.elapsedTime}
            estimatedTime={flashingState.estimatedTime}
            deviceInfo={flashingState.deviceInfo}
            onAbort={handleAbort}
            onContinue={handlePause} // Continue is now Pause/Resume
            onRestart={handleRestart}
          />
        )}
        <div
          className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <GlobalSidebar 
            fileSystem={fileSystem} 
            onFileSystemUpdate={onFileSystemUpdate} 
            refreshFileSystem={refreshFileSystem} 
            device={device}
            deviceError={deviceError}
            onConnectClick={handleConnectClick}
          />
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-r-md transition-all duration-300 z-10"
          style={{ left: isSidebarOpen ? '16rem' : '0rem' }} // 16rem = w-64
        >
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet context={{ 
            startFlashing, 
            device,
            tabs,
            activeTab,
            language,
            handleEditorChange,
            handleLanguageChange,
            addNewTab,
            closeTab,
            setActiveTab,
            activeView,
            setActiveView,
            setEditorRef: (ref) => editorRef.current = ref,
            setFlowchartRef: (ref) => flowchartRef.current = ref,
            setBlockDiagramRef: (ref) => blockDiagramRef.current = ref
          }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
