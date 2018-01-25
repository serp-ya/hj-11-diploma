class SearchPanelController{
  goToSearchPage(queryString) {
    router.navigate(`search?${queryString}`);
  };
}

const searchPanelController = new SearchPanelController();