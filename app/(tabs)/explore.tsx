
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Collapsible } from '@/components/Collapsible';

export default function AboutScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About CurioTales</ThemedText>
      </ThemedView>
      
      <ThemedText style={styles.description}>
        CurioTales brings you fascinating, bite-sized facts and stories from every corner of human knowledge.
        Discover the unexpected, the surprising, and the wonderfully weird - all generated live by AI based on your interests and age!
      </ThemedText>

      <Collapsible title="How it works">
        <ThemedText>
          • Choose from categories like Science, History, Technology, and more
        </ThemedText>
        <ThemedText>
          • Search for specific topics that interest you
        </ThemedText>
        <ThemedText>
          • Generate fresh stories with AI using the 🤖 Generate New AI Story button
        </ThemedText>
        <ThemedText>
          • Each story is crafted to be surprising and share-worthy
        </ThemedText>
      </Collapsible>

      <Collapsible title="Categories explained">
        <ThemedText>
          <ThemedText type="defaultSemiBold">Science:</ThemedText> Mind-bending discoveries and natural phenomena
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">History:</ThemedText> Forgotten tales and surprising historical connections
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Technology:</ThemedText> Innovations, inventors, and digital curiosities
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Nature:</ThemedText> Amazing animal behaviors and ecosystem wonders
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Space:</ThemedText> Cosmic phenomena and space exploration facts
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Arts & Culture:</ThemedText> Creative expressions and cultural insights
        </ThemedText>
      </Collapsible>

      <Collapsible title="AI-Powered Stories">
        <ThemedText>
          <ThemedText type="defaultSemiBold">Live Generation:</ThemedText> Every story is generated fresh by AI based on your selected topic and age range
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Age-Appropriate:</ThemedText> Content is automatically tailored to your child's reading level and comprehension
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Always Unique:</ThemedText> No two stories are ever the same - each generation creates something new and exciting
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Free to Use:</ThemedText> Powered by free LLM APIs, so you can generate unlimited stories without any cost
        </ThemedText>
      </Collapsible>

      <Collapsible title="Why CurioTales?">
        <ThemedText>
          In a world of information overload, CurioTales curates knowledge into digestible, 
          delightful nuggets that spark curiosity and make great conversation starters.
        </ThemedText>
        <ThemedText>
          Every story is crafted to surprise, every discovery is personalized to your interests, 
          and every generation is an invitation to learn more about our fascinating world.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Future features">
        <ThemedText>
          • Save your favorite stories
        </ThemedText>
        <ThemedText>
          • Share stories with friends
        </ThemedText>
        <ThemedText>
          • Daily curated collections
        </ThemedText>
        <ThemedText>
          • Audio narration of stories
        </ThemedText>
        <ThemedText>
          • Personalized recommendations
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
});
