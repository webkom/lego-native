import { cn } from '@/lib/cn';
import env from 'env';
import React, { useState } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
// import Config from 'react-native-config';

type TurnstileProps = {
  visible?: boolean;
  onTokenReceived: (token: string) => void;
  variant?: 'invisible' | 'visible';
} & ViewProps;

export const Turnstile = ({
  visible = true,
  onTokenReceived,
  variant = 'invisible',
  className,
  ...props
}: TurnstileProps) => {
  const [webViewHeight, setWebViewHeight] = useState(80);
  if (!visible) return null;
  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'height') {
      setWebViewHeight(data.height);
    } else if (data.type === 'token') {
      onTokenReceived(data.token);
    }
  };
  return (
    <View
      style={[{ height: webViewHeight }]}
      className={cn(
        'w-full',
        variant === 'invisible' ? 'absolute h-1 w-1 opacity-0' : undefined,
        className
      )}
      {...props}>
      <WebView
        originWhitelist={['*']}
        onMessage={handleMessage}
        source={{
          baseUrl: env.EXPO_PUBLIC_TURNSTILE_BASE_URL,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_turnstileCb" async defer></script>
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  #myWidget {
                    width: 100%;
                  }
                </style>
              </head>
              <body>
                <div id="myWidget"></div>
                <script>
                  function _turnstileCb() {
                    turnstile.render('#myWidget', {
                      sitekey: '${env.EXPO_PUBLIC_TURNSTILE_SITE_KEY}',
                      size: '${env.EXPO_PUBLIC_TURNSTILE_SIZE}',
                      callback: (token) => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'token', token }));
                      },
                    });
                    setTimeout(() => {
                      const widget = document.getElementById('myWidget');
                      const height = widget ? widget.offsetHeight : 80;
                      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height }));
                    }, 1000);
                    window.addEventListener('resize', () => {
                      setTimeout(() => {
                        const widget = document.getElementById('myWidget');
                        const height = widget ? widget.offsetHeight : 80;
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height }));
                      }, 100);
                    });
                  }
                </script>
              </body>
            </html>
          `,
        }}
        style={styles.webView}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});
