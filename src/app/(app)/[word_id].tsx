import { Feather } from '@expo/vector-icons';
import { router, useGlobalSearchParams } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  FloatingButton,
  LoaderScreen,
  Text,
  View,
} from 'react-native-ui-lib';
import { api } from '~/utils/trpc';

export default function WordPage() {
  const utils = api.useUtils();
  const insets = useSafeAreaInsets();
  const { word_id } = useGlobalSearchParams<{ word_id: string }>();
  const isLoggedInQuery = api.auth.isLoggedIn.useQuery();
  const getFavoriteStateQuery = api.words.getFavoriteState.useQuery(
    {
      id: word_id,
    },
    {
      enabled: !!isLoggedInQuery.data,
    },
  );
  const toggleFavoriteMutation = api.words.toggleFavorite.useMutation({
    onSuccess: () =>
      Promise.all([
        getFavoriteStateQuery.refetch(),
        utils.words.getAllFavorites.refetch(),
      ]),
  });

  const getWordQuery = api.words.get.useQuery(
    { id: word_id },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const isLoading =
    isLoggedInQuery.isLoading ||
    getFavoriteStateQuery.isLoading ||
    toggleFavoriteMutation.isPending;

  if (getWordQuery.isLoading || !getWordQuery.data) return <LoaderScreen />;

  return (
    <>
      <Button
        style={{
          zIndex: 2,
          position: 'absolute',
          top: insets.top + 8,
          left: 12,
        }}
        onPress={() => router.back()}
        iconSource={() => (
          <Feather
            name="chevron-left"
            size={24}
            color="white"
            // style={{ transform: 'translateX(-2px)' }}
          />
        )}
        round
      />
      <View
        bg-$textPrimary
        style={{ paddingTop: insets.top + 60, paddingBottom: 40 }}
      >
        <Text white text40L center style={{ fontFamily: 'Jua-Regular' }}>
          {getWordQuery.data.swardspeak_words.join(' / ')}
        </Text>
        <Text white text60L center style={{ fontFamily: 'Jua-Regular' }}>
          {getWordQuery.data.translated_words.join(' / ')}
        </Text>
      </View>

      <ScrollView
        keyboardDismissMode="interactive"
        refreshControl={
          <RefreshControl
            refreshing={
              getWordQuery.isRefetching ||
              isLoggedInQuery.isRefetching ||
              getFavoriteStateQuery.isRefetching
            }
            onRefresh={async () =>
              await Promise.all([
                getWordQuery.refetch(),
                isLoggedInQuery.refetch(),
                getFavoriteStateQuery.refetch(),
              ])
            }
          />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View padding-20>
          <Text text70>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. At dolorum
            alias nesciunt. Accusamus blanditiis vitae laborum nisi unde iure
            dolores fugit, veritatis voluptas delectus excepturi quis alias
            exercitationem vel error iste incidunt et voluptatibus odit quisquam
            adipisci dolorum? Deserunt modi odit id natus excepturi numquam hic
            nobis, alias facere provident praesentium asperiores repudiandae
            earum perferendis temporibus veritatis corporis cumque totam eos
            blanditiis, saepe magnam dicta? Dicta distinctio error aspernatur
            mollitia repellendus blanditiis a quisquam repellat commodi ducimus
            tempora voluptatibus dolor, velit, deserunt ut nam omnis
            praesentium! Ab reiciendis, ea voluptatum aperiam cumque ad. Nam
            totam architecto quasi, ullam, accusamus velit eaque sit nobis ea
            non ratione quos perferendis impedit praesentium at debitis, libero
            beatae esse. Nostrum repellat sequi aliquid, magnam natus, magni
            delectus voluptas minus, rem sint distinctio ullam libero doloribus
            iste corrupti excepturi nobis? Quo reprehenderit itaque rerum amet
            omnis modi nobis tempore necessitatibus officia. Obcaecati omnis
            laborum labore quibusdam atque! Aliquid maxime quia incidunt sequi
            dignissimos debitis fugit quod repellat. Sit repudiandae dolores
            asperiores obcaecati expedita adipisci sunt voluptates in aliquam
            ratione, modi quam quo vitae reprehenderit molestias! Impedit,
            soluta sunt id est saepe autem culpa assumenda fuga, ducimus ea
            alias accusamus omnis! Tempora sint, iusto exercitationem voluptas
            distinctio excepturi quia perferendis quaerat, eaque vero omnis
            doloremque voluptate veniam fuga assumenda possimus facilis
            recusandae sit quis vitae illo quae totam ipsam. Nesciunt,
            voluptate. Quasi, distinctio. Quia fugit odit quas sit quisquam,
            corrupti id quam at totam atque minima ut accusantium soluta
            consequuntur minus natus veniam laborum voluptate aliquam. Sunt quas
            labore aperiam, asperiores veniam voluptate saepe voluptatum
            mollitia corrupti distinctio sapiente nostrum non? Ut vero
            laudantium commodi eaque ab et nam laboriosam dolores. Cum earum
            obcaecati quas eligendi veniam, praesentium voluptatum labore
            voluptate et distinctio recusandae cupiditate at iusto porro illo
            iure officia velit? Quae laudantium illum repellat non dolores,
            facere fugiat consequatur! Voluptatem incidunt corrupti animi! Eius,
            magnam neque nobis suscipit consectetur dolor esse, illum in autem
            at rerum inventore quam corporis aspernatur cum sed sit nemo odit
            consequuntur facere doloribus. Odit, unde. Mollitia nisi molestias
            aspernatur ea veniam quis. At molestiae exercitationem minus ipsa
            voluptates cum tempore fugit ad omnis veniam vel, libero
            consequuntur explicabo vitae laboriosam ea ipsam totam dolorum
            ducimus deserunt aut sequi iure. Enim, nihil, alias animi
            consequatur dignissimos doloremque dolores ex deserunt modi ratione
            iure blanditiis nulla quo, quisquam nostrum? Mollitia, a enim!
            Error, nam consequuntur. Voluptatem magnam, voluptas vitae voluptate
            dignissimos nobis consequatur tempore quibusdam fugit culpa ducimus
            cum temporibus esse earum delectus exercitationem, maxime
            accusantium dolorum omnis excepturi modi explicabo? Harum totam a
            libero? Saepe, molestiae vel? In, ipsa facilis. Dolor ea iste
            commodi natus voluptate, placeat recusandae, beatae voluptatum
            ducimus exercitationem aperiam, quo facilis rerum expedita! Delectus
            in, laboriosam soluta doloremque voluptatibus vel ipsum sapiente
            voluptates quia quibusdam ducimus quasi recusandae rem nemo
            doloribus dignissimos. Fugit iste dicta laboriosam doloribus velit
            corrupti quaerat necessitatibus aperiam, tempore possimus veniam
            molestias nemo cumque consectetur perspiciatis, aspernatur nam
            blanditiis ipsum similique voluptatem optio in illum. Impedit
            officia eum, laborum consequatur dignissimos obcaecati magnam quasi
            incidunt laudantium quibusdam facere blanditiis consectetur sed
            soluta aliquid similique quo facilis commodi? Consequuntur maxime
            aspernatur molestias, error est nemo soluta tempore autem, saepe
            officia rem, nostrum molestiae. Expedita earum dignissimos quas
            itaque debitis, consequuntur ipsam ut quisquam vel vero similique
            quod adipisci nihil cupiditate consequatur vitae alias ad recusandae
            explicabo culpa ex sequi omnis sit delectus! Fugit tempora dolore
            aperiam accusantium possimus maiores, minus, optio id, minima
            accusamus nobis quia dolor. Soluta ratione error adipisci
            consequatur in, dolorum qui, aspernatur nobis eveniet corporis
            ducimus eos saepe est dignissimos sapiente atque, maiores nihil unde
            nam illum enim? Esse eius, inventore modi consectetur sed ullam
            libero architecto, magni saepe neque possimus fugiat officia
            molestias obcaecati tempore ea! Id minima aliquid similique minus
            corrupti assumenda sapiente nam laboriosam neque, veniam maiores ad
            quis molestias asperiores rem tempore. Non veritatis, odio veniam
            qui consequatur voluptatem itaque, natus beatae tenetur nobis ab
            facilis magni rem facere cumque ex nihil quos et adipisci
            voluptatum! Consectetur, alias. Fuga eligendi, neque cumque pariatur
            veniam repellat unde ipsa doloremque aliquid ad obcaecati,
            voluptatem ex explicabo corrupti quod, aut tenetur et? Officia,
            autem laborum tempore optio officiis sit sed porro facilis quas quae
            ipsa amet perferendis nostrum ea cumque illum atque magnam rem
            inventore laudantium! Facere autem necessitatibus aperiam, illo
            minus quam in tenetur, eaque quod minima asperiores. Nisi dolor
            ipsum dignissimos aspernatur, tempora non laboriosam aperiam
            voluptatum, necessitatibus, omnis quidem doloremque quis quibusdam
            debitis veniam dolore ad a. Repellendus, nisi, fuga mollitia
            repudiandae labore ad quod odit dicta perspiciatis vero expedita
            inventore tempora consequuntur, harum et cupiditate in autem. Fuga
            molestias pariatur quo maiores consectetur natus corrupti, ut, in
            cupiditate accusantium ipsam nam maxime itaque et quia, eveniet
            ducimus atque inventore. Veritatis inventore hic adipisci? Quas
            beatae explicabo dolores temporibus officia dolore iusto nemo
            inventore obcaecati soluta. Dolorum aut corrupti molestiae
            repudiandae praesentium repellendus porro temporibus aliquid
            doloremque, fuga ratione modi ducimus? Molestiae, pariatur vitae
            laboriosam, recusandae vel dignissimos ipsum soluta quas magni,
            repudiandae mollitia? Adipisci magni, quod placeat id, voluptatem
            dolor incidunt earum sapiente excepturi a quos, odit quisquam
            architecto accusamus consectetur. Quaerat in nisi obcaecati pariatur
            eos vero mollitia fugiat, cum minima iusto aperiam, dolores
            voluptatem adipisci soluta. Tenetur, cumque debitis! Laudantium,
            vero cum excepturi nam et quo ipsum exercitationem recusandae totam
            unde rerum quaerat perferendis? Qui ex ullam cum dolore aut numquam
            repudiandae, nesciunt iure explicabo, ipsa quasi expedita velit
            libero aperiam dolorem sapiente obcaecati. Nostrum nesciunt
            laboriosam optio officia quisquam id, impedit veritatis enim
            corrupti labore unde ipsa sapiente quaerat! Maxime tempore fugit
            saepe ratione rerum earum perferendis odio voluptate mollitia,
            eveniet omnis, adipisci, modi veniam nobis! Dolorum maiores tempore
            aliquam quae doloremque odit dolores similique maxime minus!
            Voluptas, reprehenderit vel! Sit aliquid, aperiam at corporis amet
            molestias nulla quae expedita, obcaecati placeat aut dolorum quis
            delectus cum doloribus? Soluta dignissimos architecto rerum sequi
            perspiciatis? Recusandae deleniti fugiat inventore, suscipit nisi
            odit porro quas facere neque earum at ipsa quae accusantium ut
            libero placeat! Nihil corporis repudiandae temporibus vitae
            consectetur molestias commodi!
          </Text>
        </View>
      </ScrollView>
      <FloatingButton
        visible
        bottomMargin={40}
        button={{
          disabled: isLoading,
          iconSource: isLoading
            ? () => <ActivityIndicator size={24} />
            : undefined,
          label: isLoading
            ? undefined
            : !getFavoriteStateQuery.data || !isLoggedInQuery.data
              ? 'Add to favorite'
              : 'Remove from favorite',
          onPress: () =>
            !isLoggedInQuery.data
              ? router.push('/(app)/auth')
              : toggleFavoriteMutation.mutate({ id: word_id }),
        }}
      />
    </>
  );
}
