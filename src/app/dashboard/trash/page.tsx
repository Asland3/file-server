import FileBrowser from "../_components/file-browser";

function Trash() {
  return (
    <div>
      <FileBrowser title="Favorites" deletedOnly />
    </div>
  );
}

export default Trash;
