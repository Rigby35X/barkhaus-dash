import React, { useState } from 'react';
import { Zap, CheckCircle, AlertCircle, Copy } from 'lucide-react';

const OpenAITester: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setResult({ success: false, message: 'Please enter an API key' });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setResult({ success: false, message: 'API key should start with "sk-"' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing OpenAI API key...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: 'Return a JSON object with a "test" field set to "success" and a "message" field with "API key is working".'
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 100,
          temperature: 0
        }),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        let message = 'API key test failed: ';
        if (response.status === 401) {
          message += 'Invalid API key. Please check your key.';
        } else if (response.status === 429) {
          message += 'Rate limit exceeded. Please try again later.';
        } else if (response.status === 403) {
          message += 'Access denied. Check your API key permissions.';
        } else if (errorData.error?.code === 'insufficient_quota') {
          message += 'Insufficient quota. Please check your OpenAI billing.';
        } else {
          message += errorData.error?.message || errorData.message || `HTTP ${response.status}`;
        }

        setResult({ 
          success: false, 
          message,
          details: errorData 
        });
        return;
      }

      const data = await response.json();
      console.log('✅ API Response:', data);

      const content = data.choices[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          if (parsed.test === 'success') {
            setResult({ 
              success: true, 
              message: 'API key is valid and working perfectly!',
              details: data
            });
            
            // Save the working API key
            localStorage.setItem('openai_api_key', apiKey);
          } else {
            setResult({ 
              success: false, 
              message: 'API responded but with unexpected content',
              details: parsed
            });
          }
        } catch (parseError) {
          setResult({ 
            success: false, 
            message: 'API responded but content is not valid JSON',
            details: { content, parseError }
          });
        }
      } else {
        setResult({ 
          success: false, 
          message: 'API responded but no content returned',
          details: data
        });
      }

    } catch (error) {
      console.error('❌ Network Error:', error);
      setResult({ 
        success: false, 
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyWorkingKey = () => {
    if (result?.success && apiKey) {
      navigator.clipboard.writeText(`VITE_OPENAI_API_KEY=${apiKey}`);
      alert('Environment variable copied to clipboard! Add this to your .env file.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🧪 OpenAI API Key Tester</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setResult(null);
            }}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </div>

        <button
          onClick={testApiKey}
          disabled={isLoading || !apiKey.trim()}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Zap className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Testing API Key...' : 'Test API Key'}</span>
        </button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </p>
                
                {result.success && (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={copyWorkingKey}
                      className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Environment Variable</span>
                    </button>
                    <p className="text-sm text-green-700">
                      ✅ API key saved to browser storage and ready to use!
                    </p>
                  </div>
                )}

                {result.details && !result.success && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer text-gray-600">
                      Show technical details
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">💡 Common Issues & Solutions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Invalid API key:</strong> Make sure it starts with "sk-" and is copied correctly</li>
            <li>• <strong>Insufficient quota:</strong> Check your OpenAI billing and usage limits</li>
            <li>• <strong>Rate limit:</strong> Wait a moment and try again</li>
            <li>• <strong>Network error:</strong> Check your internet connection</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-900 mb-2">🔒 Security Note</h3>
          <p className="text-sm text-yellow-800">
            This test runs directly in your browser. Your API key is not sent to any third-party servers 
            except OpenAI. For production use, consider server-side API key management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenAITester;
