export const useTheme = () => {
  const themeCookie = useCookie("theme", {
    default: () => "light",
    maxAge: 31536000, /* 1 year */
  });

  const currentTheme = computed(() => themeCookie.value);

  const toggleTheme = () => {
    themeCookie.value = currentTheme.value === "light" ? "dark" : "light";
  };

  return {
    currentTheme,
    toggleTheme,
  };
};
