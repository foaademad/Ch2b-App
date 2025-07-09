// src/styles/styles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 20,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
   
   
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    height: 48,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 0,
  },
  searchText: {
    flex: 1,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#2c3e50',
    marginVertical: 16,
    paddingHorizontal: 16,
    textAlign: 'right',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
   
  },
  seeAll: {
      fontSize: 15,
      fontFamily: 'Poppins-Medium',
      color: '#36c7f6',
      textAlign: 'center',
      

  },
});