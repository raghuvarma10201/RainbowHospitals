// __tests__/rtl.test.ts
import {I18nManager} from 'react-native';
import {configureRTL} from '../rtl';

describe('configureRTL', () => {
  const originalAllowRTL = I18nManager.allowRTL;
  const originalForceRTL = I18nManager.forceRTL;
  const originalIsRTL = I18nManager.isRTL;

  beforeEach(() => {
    I18nManager.allowRTL = jest.fn();
    I18nManager.forceRTL = jest.fn();
  });

  afterEach(() => {
    I18nManager.allowRTL = originalAllowRTL;
    I18nManager.forceRTL = originalForceRTL;
    (I18nManager as any).isRTL = originalIsRTL;
    jest.resetAllMocks();
  });

  it('should disable RTL when isRTL is true', () => {
    (I18nManager as any).isRTL = true;

    configureRTL();

    expect(I18nManager.allowRTL).toHaveBeenCalledWith(false);
    expect(I18nManager.forceRTL).toHaveBeenCalledWith(false);
  });

  it('should do nothing when isRTL is false', () => {
    (I18nManager as any).isRTL = false;

    configureRTL();

    expect(I18nManager.allowRTL).not.toHaveBeenCalled();
    expect(I18nManager.forceRTL).not.toHaveBeenCalled();
  });
});
