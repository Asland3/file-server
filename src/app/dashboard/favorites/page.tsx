"use client";

import FileBrowser from "../_components/file-browser";

function FavoritesPage() {
  return (
    <div>
      <FileBrowser title="Favorites" favoritesOnly />
    </div>
  );
}

export default FavoritesPage;
