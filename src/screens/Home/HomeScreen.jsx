import BottomNavigationBar from "../../components/NavBar/BottomNavigationBar";
const HomeScreen = () => {
  // const [response, setResponse] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const profileId = "5f94dd86-37b2-43a3-962b-036a3c03d3c9";
  //       const response = await getProfile(profileId);
  //       setResponse(response);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }, []);

  return (
    // <SafeAreaView>
    // {/* <ViGoSpinner isLoading={isLoading} /> */}
    // {/* <View style={styles.header}><Header title="Thông tin tài khoản" /></View> */}
    <BottomNavigationBar />
    // </SafeAreaView>
  );
};

export default HomeScreen;
