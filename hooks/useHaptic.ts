import * as Haptics from 'expo-haptics';
import { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';

export { ImpactFeedbackStyle, NotificationFeedbackType, AndroidHaptics } from 'expo-haptics';

export type ImpactType = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid';
export type NotificationType = 'success' | 'warning' | 'error';
export type SelectionType = 'selection';
export type StandardFeedbackType = ImpactType | NotificationType | SelectionType;
export type AndroidFeedbackType = `${Haptics.AndroidHaptics}`;
export type HapticFeedbackType =
  | StandardFeedbackType
  | AndroidFeedbackType
  | Haptics.AndroidHaptics;

export type HapticHandler = () => Promise<void>;

export interface UseHapticReturn {
  (overrideType?: unknown): Promise<void>;
  light: HapticHandler;
  medium: HapticHandler;
  heavy: HapticHandler;
  soft: HapticHandler;
  rigid: HapticHandler;
  selection: HapticHandler;
  success: HapticHandler;
  warning: HapticHandler;
  error: HapticHandler;
  android: (type: Haptics.AndroidHaptics | AndroidFeedbackType) => Promise<void>;
  trigger: (type?: HapticFeedbackType) => Promise<void>;
  handlers: Record<StandardFeedbackType, HapticHandler>;
}

const safeAsync = async (fn: () => Promise<void>): Promise<void> => {
  try {
    await fn();
  } catch {
    // Gracefully ignore errors on devices/simulators where haptics are not supported or disabled
  }
};

/**
 * Custom hook to trigger haptic feedback in React Native (iOS & Android).
 *
 * Includes support for all standard expo-haptics feedback types as well as
 * new developments in the expo-haptics library:
 * - `soft` and `rigid` impact styles (introduced alongside `light`, `medium`, `heavy`).
 * - `performAndroidHapticsAsync` with `AndroidHaptics` constants (introduced in modern Expo SDKs
 *    to leverage native Android haptic feedback without requiring the VIBRATE permission).
 * - Safe fallback execution on unsupported devices and simulators.
 *
 * @example
 * // 1. Direct callback (as in the article)
 * const onPress = useHaptic('light');
 * <Pressable onPress={onPress} />
 *
 * // 2. Default selection feedback
 * const onSelect = useHaptic();
 * <Pressable onPress={onSelect} />
 *
 * // 3. Destructured handlers
 * const { success, error, light } = useHaptic();
 * <Button onPress={success} />
 *
 * // 4. Android-specific haptics
 * const { android } = useHaptic();
 * android(AndroidHaptics.Confirm);
 */
export const useHaptic = (
  defaultFeedbackType: HapticFeedbackType = 'selection'
): UseHapticReturn => {
  const createImpactHandler = useCallback(
    (style: Haptics.ImpactFeedbackStyle) => () => safeAsync(() => Haptics.impactAsync(style)),
    []
  );

  const createNotificationHandler = useCallback(
    (type: Haptics.NotificationFeedbackType) => () =>
      safeAsync(() => Haptics.notificationAsync(type)),
    []
  );

  const selectionHandler = useCallback<HapticHandler>(
    () => safeAsync(() => Haptics.selectionAsync()),
    []
  );

  const androidHandler = useCallback(async (type: Haptics.AndroidHaptics | AndroidFeedbackType) => {
    await safeAsync(async () => {
      if (Platform.OS === 'android') {
        await Haptics.performAndroidHapticsAsync(type as Haptics.AndroidHaptics);
      } else {
        // iOS fallback mappings for Android constants
        switch (type) {
          case Haptics.AndroidHaptics.Confirm:
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case Haptics.AndroidHaptics.Reject:
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case Haptics.AndroidHaptics.Long_Press:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case Haptics.AndroidHaptics.Context_Click:
          case Haptics.AndroidHaptics.Drag_Start:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case Haptics.AndroidHaptics.Toggle_On:
          case Haptics.AndroidHaptics.Toggle_Off:
          case Haptics.AndroidHaptics.Keyboard_Press:
          case Haptics.AndroidHaptics.Keyboard_Release:
          case Haptics.AndroidHaptics.Virtual_Key:
          case Haptics.AndroidHaptics.Virtual_Key_Release:
          case Haptics.AndroidHaptics.Gesture_Start:
          case Haptics.AndroidHaptics.Gesture_End:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case Haptics.AndroidHaptics.Clock_Tick:
          case Haptics.AndroidHaptics.Keyboard_Tap:
          case Haptics.AndroidHaptics.Segment_Tick:
          case Haptics.AndroidHaptics.Segment_Frequent_Tick:
          case Haptics.AndroidHaptics.Text_Handle_Move:
            await Haptics.selectionAsync();
            break;
          case Haptics.AndroidHaptics.No_Haptics:
            break;
          default:
            await Haptics.selectionAsync();
            break;
        }
      }
    });
  }, []);

  const handlers = useMemo(
    () => ({
      // Impacts (including soft & rigid)
      light: createImpactHandler(Haptics.ImpactFeedbackStyle.Light),
      medium: createImpactHandler(Haptics.ImpactFeedbackStyle.Medium),
      heavy: createImpactHandler(Haptics.ImpactFeedbackStyle.Heavy),
      soft: createImpactHandler(Haptics.ImpactFeedbackStyle.Soft),
      rigid: createImpactHandler(Haptics.ImpactFeedbackStyle.Rigid),

      // Selection
      selection: selectionHandler,

      // Notifications
      success: createNotificationHandler(Haptics.NotificationFeedbackType.Success),
      warning: createNotificationHandler(Haptics.NotificationFeedbackType.Warning),
      error: createNotificationHandler(Haptics.NotificationFeedbackType.Error),
    }),
    [createImpactHandler, createNotificationHandler, selectionHandler]
  );

  const trigger = useCallback(
    async (type?: HapticFeedbackType) => {
      const targetType = type ?? defaultFeedbackType;

      if (targetType in handlers) {
        await handlers[targetType as StandardFeedbackType]();
      } else {
        await androidHandler(targetType as Haptics.AndroidHaptics | AndroidFeedbackType);
      }
    },
    [androidHandler, defaultFeedbackType, handlers]
  );

  const callable = useCallback(
    async (override?: unknown) => {
      // In React Native, onPress event handlers receive a GestureResponderEvent object.
      // If a string or valid type is explicitly passed, use it; otherwise default to defaultFeedbackType.
      if (typeof override === 'string') {
        await trigger(override as HapticFeedbackType);
      } else {
        await trigger(defaultFeedbackType);
      }
    },
    [defaultFeedbackType, trigger]
  );

  return useMemo(() => {
    return Object.assign(callable, {
      ...handlers,
      android: androidHandler,
      trigger,
      handlers,
    }) as UseHapticReturn;
  }, [androidHandler, callable, handlers, trigger]);
};

export default useHaptic;
