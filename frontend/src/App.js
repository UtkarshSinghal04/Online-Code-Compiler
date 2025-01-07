import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import studs from './studs'
import AceEditor from 'react-ace';
// Import AceEditor themes and modes
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/ext-language_tools';
//themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-clouds_midnight";

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp')
  const [jobId, setJobId] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [jobDetails, setJobDetails] = useState({});
  const [codeTheme, setCodeTheme] = useState('twilight')

  useEffect(() => {
    setCode(studs[language]);
    setOutput('');
    setJobStatus('')
  }, [language])

  useEffect(() => {
    const default_language = localStorage.getItem("default-language") || 'cpp'
    setLanguage(default_language)
  }, [])

  const handleSubmit = async () => {
    const payload = {
      language,
      code
    };

    try {
      setOutput('');
      setJobId('');
      setJobStatus('');
      setJobDetails({});

      const response = await axios.post('http://localhost:3000/code/run', payload);

      if (response.data.jobId) {
        const newJobId = response.data.jobId;
        setJobId(newJobId);
        setJobStatus('Submitted');

        //polling
        const pollInterval = setInterval(async () => {
          const response = await axios.get(`http://localhost:3000/code/status`, {
            params: {
              jobId: newJobId
            }
          });

          const { success, job, error } = response.data;

          if (success) {
            setJobStatus(job.status);
            setJobDetails(job);
            if (job.status === 'pending') return;
            setOutput(job.output);
            clearInterval(pollInterval);
          }
          else {
            setJobStatus('Error! Retry again');
            setOutput(error);
            clearInterval(pollInterval);
          }
        }, 1000);
      }
      else {
        setJobStatus('Error! Retry again');
        setOutput(response.data.error);
      }
    }
    catch ({ response }) {
      if (response) {
        console.log(response.data.stderr)
        setOutput(response.data.stderr);
      }
      else {
        console.log('Server is down')
        setOutput('Server is down');
      }
    }

  }

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }

    let { submittedAt, startedAt, completedAt } = jobDetails;

    submittedAt = moment(submittedAt).toString();
    if (!startedAt || !completedAt) {
      return '';
    }

    let result = ''
    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = moment.duration(end.diff(start));
    result += `\nExecution time: ${executionTime.asSeconds()}s`;
    return result;
  };

  return (
    <div className="min-h-screen p-2 bg-gray-900 text-gray-200 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-bold text-gray-100 text-center mb-6">
          Online Code Compiler
        </h1>
        <div className="mb-4">
          <label className="text-gray-300 mb-2">Language: </label>
          <select
            className="w-1/4 p-2 ml-2 mr-16 border rounded-md border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-gray-100"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
            <option value="c">C</option>
          </select>

          <button className='ml-96 bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
            onClick={() => { localStorage.setItem("default-language", language); }}
          >Set Default</button>
        </div>
        <div className="mb-4 flex">
          <label className="text-gray-300 mt-2 mr-4">Theme: </label>
          <div className="flex space-x-2">
            {['twilight', 'monokai', 'solarized_dark', 'dracula', 'github'].map((themeOption) => (
              <button
                key={themeOption}
                className={`p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 ${
                  codeTheme === themeOption ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setCodeTheme(themeOption)}
              >
                {themeOption}
              </button>
            ))}
          </div>
        </div>
        <AceEditor
          mode={language === 'py' ? 'python' : 'c_cpp'}
          theme = {codeTheme}
          onChange={(newValue) => setCode(newValue)}
          value={code}
          name="code-editor"
          width="100%"
          height="300px"
          fontSize={14}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 4,
            printMargin: false, // Disable the vertical line
          }}
        />
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit Code
        </button>
      </div>
      <div className="mt-6 bg-gray-700 border border-gray-600 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-300">Output:</h2>
        <pre className="mt-2 text-sm text-gray-100 bg-gray-800 p-3 rounded-md overflow-auto">
          {output || "No output yet"}
        </pre>
      </div>
      <div className="mt-6 bg-gray-700 border border-gray-600 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-300 mt-6">Status:</h2>
        <p className="text-sm text-gray-100">{jobStatus}</p>
        <h2 className="text-lg font-semibold text-gray-300 mt-6">Details:</h2>
        <p className="text-sm text-gray-100">{renderTimeDetails()}</p>
      </div>
    </div>
    </div >
  );
}

export default App;