
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Modal, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { StoryGenerator } from '@/services/storyGenerator';

interface CurioStory {
  id: string;
  title: string;
  content: string;
  category: string;
  ageRange: string;
  icon?: string;
}

const categories = [
  { name: 'Science', icon: '🧪' },
  { name: 'History', icon: '🏺' },
  { name: 'Technology', icon: '💻' },
  { name: 'Nature', icon: '🌿' },
  { name: 'Space', icon: '🚀' },
  { name: 'Arts', icon: '🎨' },
  { name: 'Culture', icon: '🌍' },
  { name: 'Random', icon: '🎲' }
];

const ageRanges = [
  { name: '1-3 years', icon: '👶' },
  { name: '3-5 years', icon: '🧒' },
  { name: '5-7 years', icon: '👦' },
  { name: '7-9 years', icon: '👧' },
  { name: '9-12 years', icon: '🧑' },
  { name: '12-14 years', icon: '👨' }
];

export default function CurioTales() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAgeRange, setSelectedAgeRange] = useState('');
  const [stories, setStories] = useState<CurioStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStory, setSelectedStory] = useState<CurioStory | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStoriesPage, setShowStoriesPage] = useState(false);


  const getIconForCategory = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Science': '🧪',
      'History': '🏺',
      'Technology': '💻',
      'Nature': '🌿',
      'Space': '🚀',
      'Arts': '🎨',
      'Culture': '🌍',
      'Random': '🎲'
    };
    return categoryMap[category] || '📖';
  };

  const generateStories = async (topic: string, category?: string) => {
    // Check if we have both age range and topic/category
    if (!selectedAgeRange || (!topic && !category)) {
      if (!selectedAgeRange) {
        Alert.alert('Age Range Required', 'Please select an age range to generate a story!');
      } else {
        Alert.alert('Topic Required', 'Please select a category or search for a topic!');
      }
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Generating live story for:', { topic, category, selectedAgeRange });
      
      const storyResponse = await StoryGenerator.generateStory({
        topic: topic || category || 'amazing discoveries',
        category: category || 'General',
        ageRange: selectedAgeRange,
      });

      console.log('Generated story:', storyResponse);
      
      setStories([storyResponse]);
      setShowStoriesPage(true);
    } catch (error) {
      console.error('Error generating story:', error);
      Alert.alert(
        'Generation Error', 
        'Failed to generate story. Please try again or check your internet connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
    
    // If age range is already selected, generate immediately
    if (selectedAgeRange) {
      generateStories('', category);
    }
    // If no age range selected, just store the category selection
    // User will generate when they select age range
  };

  const handleAgeRangePress = (ageRange: string) => {
    setSelectedAgeRange(ageRange);
    
    // If a category or search term is already selected, generate immediately
    if (selectedCategory || searchTerm.trim()) {
      generateStories(searchTerm.trim(), selectedCategory || undefined);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSelectedCategory('');
      
      // If age range is already selected, generate immediately
      if (selectedAgeRange) {
        generateStories(searchTerm);
      }
      // If no age range selected, just store the search term
      // User will generate when they select age range
    }
  };

  const handleRefresh = () => {
    generateStories(searchTerm, selectedCategory || 'Random');
  };

  const openStoryModal = (story: CurioStory) => {
    setSelectedStory(story);
    setModalVisible(true);
  };

  const closeStoryModal = () => {
    setModalVisible(false);
    setSelectedStory(null);
  };

  const goBackToHome = () => {
    setShowStoriesPage(false);
    setStories([]);
    setSelectedCategory('');
    setSearchTerm('');
    // Keep selectedAgeRange so user doesn't have to reselect
  };

  // Split categories into two rows
  const firstRowCategories = categories.slice(0, 4);
  const secondRowCategories = categories.slice(4);

  // Split age ranges into two rows
  const firstRowAgeRanges = ageRanges.slice(0, 3);
  const secondRowAgeRanges = ageRanges.slice(3);

  if (showStoriesPage) {
    return (
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.storiesHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToHome}
          >
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Refresh Button */}
        <View style={styles.refreshContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>
              🤖 Generate New AI Story
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stories */}
        <ScrollView style={styles.storiesScrollView}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>🤖 AI is crafting your personalized story...</Text>
              <Text style={styles.loadingSubtext}>This may take a few moments</Text>
            </View>
          ) : (
            <View style={styles.storiesContainer}>
              {stories.length > 0 && (
                <TouchableOpacity
                  style={styles.singleStoryCard}
                  onPress={() => openStoryModal(stories[0])}
                >
                  <View style={styles.storyHeader}>
                    <Text style={styles.storyIcon}>{stories[0].icon}</Text>
                    <Text style={styles.storyCategory}>
                      {stories[0].category} • {stories[0].ageRange}
                    </Text>
                  </View>
                  <Text style={styles.storyTitle}>
                    {stories[0].title}
                  </Text>
                  <Text style={styles.storyPreview}>
                    {stories[0].content.substring(0, 150)}...
                  </Text>
                  <Text style={styles.tapToRead}>Tap to read the full story</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Story Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeStoryModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeStoryModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedStory && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.modalStoryHeader}>
                  <Text style={styles.modalStoryIcon}>{selectedStory.icon}</Text>
                  <Text style={styles.modalStoryCategory}>
                    {selectedStory.category} • {selectedStory.ageRange}
                  </Text>
                </View>
                <Text style={styles.modalStoryTitle}>{selectedStory.title}</Text>
                <Text style={styles.modalStoryContent}>{selectedStory.content}</Text>
              </ScrollView>
            )}
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.appTitle}>CurioTales</ThemedText>
        <ThemedText style={styles.tagline}>
          Bite-sized wonders from every corner of knowledge
        </ThemedText>
      </ThemedView>

      {/* Categories */}
      <ThemedView style={styles.categoriesContainer}>
        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
        <View style={styles.tagsRowContainer}>
          <View style={styles.tagsRow}>
            {firstRowCategories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: 'white',
                    borderColor: '#6366f1',
                  },
                ]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Text style={styles.chipIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: '#6366f1',
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tagsRow}>
            {secondRowCategories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: 'white',
                    borderColor: '#6366f1',
                  },
                ]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Text style={styles.chipIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: '#6366f1',
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ThemedView>

      {/* Age Ranges */}
      <ThemedView style={styles.categoriesContainer}>
        <ThemedText style={styles.sectionTitle}>Age Range</ThemedText>
        <View style={styles.tagsRowContainer}>
          <View style={styles.tagsRow}>
            {firstRowAgeRanges.map((ageRange) => (
              <TouchableOpacity
                key={ageRange.name}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedAgeRange === ageRange.name ? '#6366f1' : 'white',
                    borderColor: '#6366f1',
                  },
                ]}
                onPress={() => handleAgeRangePress(ageRange.name)}
              >
                <Text style={styles.chipIcon}>{ageRange.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedAgeRange === ageRange.name ? '#fff' : '#6366f1',
                    },
                  ]}
                >
                  {ageRange.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tagsRow}>
            {secondRowAgeRanges.map((ageRange) => (
              <TouchableOpacity
                key={ageRange.name}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedAgeRange === ageRange.name ? '#6366f1' : 'white',
                    borderColor: '#6366f1',
                  },
                ]}
                onPress={() => handleAgeRangePress(ageRange.name)}
              >
                <Text style={styles.chipIcon}>{ageRange.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedAgeRange === ageRange.name ? '#fff' : '#6366f1',
                    },
                  ]}
                >
                  {ageRange.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Type any topic here"
            placeholderTextColor="#6b7280"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Generate Button - Only show when both selections are made */}
      {(selectedAgeRange && (selectedCategory || searchTerm.trim())) && (
        <ThemedView style={styles.generateContainer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => generateStories(searchTerm.trim(), selectedCategory || undefined)}
          >
            <Text style={styles.generateButtonText}>
              🤖 Generate AI Story
            </Text>
          </TouchableOpacity>
        </ThemedView>
      )}

      {/* Selection Status */}
      {!selectedAgeRange && (selectedCategory || searchTerm.trim()) && (
        <ThemedView style={styles.statusContainer}>
          <Text style={styles.statusText}>
            ✅ Topic selected: {selectedCategory || searchTerm}
          </Text>
          <Text style={styles.statusSubtext}>
            Now select an age range to generate your story!
          </Text>
        </ThemedView>
      )}

      {selectedAgeRange && !selectedCategory && !searchTerm.trim() && (
        <ThemedView style={styles.statusContainer}>
          <Text style={styles.statusText}>
            ✅ Age range selected: {selectedAgeRange}
          </Text>
          <Text style={styles.statusSubtext}>
            Now select a category or search for a topic!
          </Text>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#6b7280',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  tagsRowContainer: {
    gap: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
    minHeight: 40,
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 400,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2937',
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: '#6366f1',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  generateContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  generateButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    backgroundColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  storiesHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
  refreshContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#6366f1',
    backgroundColor: 'white',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6366f1',
  },
  storiesScrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  storiesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
  },
  storiesGrid: {
    gap: 16,
  },
  storyCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  singleStoryCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  tapToRead: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storyIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  storyCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6366f1',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
    color: '#1f2937',
  },
  storyPreview: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-end',
    backgroundColor: 'white',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalStoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalStoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  modalStoryCategory: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6366f1',
  },
  modalStoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 32,
    color: '#1f2937',
  },
  modalStoryContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    paddingBottom: 40,
  },
});
