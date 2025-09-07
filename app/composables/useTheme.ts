export const useTheme = () => {
  const themeCookie = useCookie("theme", { default: () => "light" });

  const currentTheme = computed(() => themeCookie.value);

  const toggleTheme = () => {
    themeCookie.value = currentTheme.value === "light" ? "dark" : "light";
  };

  return {
    currentTheme,
    toggleTheme,
  };
};
