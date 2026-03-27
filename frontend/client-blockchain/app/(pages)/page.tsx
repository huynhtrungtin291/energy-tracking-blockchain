import { useAuth } from "../context/UserAuth";

export default function Home() {

  const { userAuth, isAuthLoading } = useAuth();
  
  return (
    <div>
      Home
    </div>
  );
}
