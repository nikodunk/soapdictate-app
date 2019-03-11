package com.ehrmobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.wenkesj.voice.VoicePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.christopherdro.RNPrint.RNPrintPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.dooboolab.RNIap.RNIapPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VoicePackage(),
            new VectorIconsPackage(),
            new RNSoundPackage(),
            new RNPrintPackage(),
            new RNMixpanel(),
            new RNIapPackage(),
            new RNHTMLtoPDFPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
