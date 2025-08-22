// JitsiContext.tsx
import React, {createContext, useState, useContext} from 'react';
import JitsiModal from '../pages/appointments/jitsi-modal';

const JitsiContext = createContext<any>(null);

export const useJitsi = () => useContext(JitsiContext);

const JitsiProvider = ({children}: any) => {
  const [jitsiOptions, setJitsiOptions] = useState(null);

  const showJitsi = (options: any) => setJitsiOptions(options);
  const hideJitsi = () => setJitsiOptions(null);

  return (
    <JitsiContext.Provider value={{showJitsi, hideJitsi}}>
      {children}
      {jitsiOptions && (
        <JitsiModal visible options={jitsiOptions} onClose={hideJitsi} />
      )}
    </JitsiContext.Provider>
  );
};

export default JitsiProvider;
